let cachedPrivacyPolicy: string | null = null;
let cachedTermsOfService: string | null = null;

export interface ParsedSection {
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list' | 'listItem';
  content: string;
  items?: string[];
}

export async function getPrivacyPolicy(): Promise<string> {
  if (cachedPrivacyPolicy) {
    return cachedPrivacyPolicy;
  }

  try {
    const response = await fetch('/legal/Privacy_Policy_Feb_16_2026.txt');
    if (!response.ok) {
      throw new Error('Failed to fetch privacy policy');
    }
    cachedPrivacyPolicy = await response.text();
    return cachedPrivacyPolicy;
  } catch (error) {
    console.error('Error loading privacy policy:', error);
    throw error;
  }
}

export async function getTermsOfService(): Promise<string> {
  if (cachedTermsOfService) {
    return cachedTermsOfService;
  }

  try {
    const response = await fetch('/legal/Terms_of_Service_Feb_16_2026.txt');
    if (!response.ok) {
      throw new Error('Failed to fetch terms of service');
    }
    cachedTermsOfService = await response.text();
    return cachedTermsOfService;
  } catch (error) {
    console.error('Error loading terms of service:', error);
    throw error;
  }
}

export function parseTextToSections(text: string): ParsedSection[] {
  const lines = text.split('\n');
  const sections: ParsedSection[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join(' ').trim();
      if (content) {
        sections.push({
          type: 'paragraph',
          content,
        });
      }
      currentParagraph = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      i++;
      continue;
    }

    if (trimmed.match(/^\d+\.\s/)) {
      flushParagraph();
      const match = trimmed.match(/^(\d+\.\s.+)$/);
      if (match) {
        sections.push({
          type: 'heading2',
          content: match[1],
        });
      }
      i++;
    } else if (trimmed.match(/^[A-Z][A-Za-z\s]+:$/)) {
      flushParagraph();
      sections.push({
        type: 'heading3',
        content: trimmed.slice(0, -1),
      });
      i++;
    } else if (trimmed.startsWith('- ')) {
      flushParagraph();
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      sections.push({
        type: 'list',
        content: '',
        items: listItems,
      });
    } else {
      currentParagraph.push(trimmed);
      i++;
    }
  }

  flushParagraph();
  return sections;
}
