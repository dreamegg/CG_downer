// ChatGPT DOM을 관대하게 대응: chat.openai.com, chatgpt.com
// 메시지 컨테이너 탐색 규칙: [data-message-author-role], role="article" 내 텍스트, 코드블록(pre>code)

function getTitle() {
  // 페이지 상단의 대화 제목 시도, 없으면 탭 타이틀 사용
  const h = document.querySelector('h1, header h2, main h1');
  const t = (h?.textContent || document.title || 'ChatGPT Conversation').trim();
  return t.replace(/\s+/g, ' ');
}

function sanitize(text) {
  return text.replace(/\u00a0/g, ' ').replace(/\s+\n/g, '\n').trim();
}

function extractOneMessage(node) {
  const role = node.getAttribute('data-message-author-role')
    || (node.querySelector('[data-message-author-role="assistant"]') ? 'assistant' : null)
    || node.getAttribute('data-testid')
    || (node.innerText?.startsWith('You') ? 'user' : 'assistant');

  // 본문 HTML
  const clones = node.cloneNode(true);

  // 코드블록은 삼중 백틱으로
  clones.querySelectorAll('pre code').forEach(code => {
    const lang = code.className.split('language-')[1] || '';
    const src = code.textContent;
    const fence = '```' + lang + '\n' + src + '\n```';
    const wrapper = document.createElement('p');
    wrapper.textContent = fence; // 일단 텍스트로 두고 나중 join 시 처리
    code.parentElement.replaceWith(wrapper);
  });

  // 불필요한 버튼/메뉴 제거
  clones.querySelectorAll('button, svg, nav, menu, footer').forEach(e => e.remove());

  const paragraphs = Array.from(clones.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6'))
    .map(e => e.textContent);

  // fallback: innerText
  let text = paragraphs.join('\n');
  if (!text.trim()) text = clones.innerText || '';

  return {
    role: (role || 'assistant').toLowerCase(),
    text: sanitize(text)
  };
}

function collectMessages() {
  // 1순위: 명시적 data-message-author-role
  let nodes = Array.from(document.querySelectorAll('[data-message-author-role]'));
  // 2순위: article 요소들
  if (nodes.length === 0) nodes = Array.from(document.querySelectorAll('main article'));
  // 3순위: 메시지 비슷한 블록
  if (nodes.length === 0) nodes = Array.from(document.querySelectorAll('main div')).filter(d =>
    d.innerText && d.innerText.length > 0 && d.querySelector('pre, p')
  );

  return nodes.map(extractOneMessage).filter(m => m.text);
}

function toMarkdown(title, messages) {
  const lines = [];
  const ts = new Date().toISOString();

  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`> Exported: ${ts}`);
  lines.push('');

  messages.forEach((m, i) => {
    const role = m.role === 'user' ? 'User' : 'Assistant';
    lines.push(`## ${i + 1}. ${role}`);
    // 삼중백틱 변환 처리
    const finalText = m.text.replace(/^```/gm, '\n```').replace(/```$/gm, '```\n');
    lines.push(finalText);
    lines.push('');
  });

  return lines.join('\n');
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'COLLECT_MD') {
    try {
      const title = getTitle();
      const messages = collectMessages();
      const md = toMarkdown(title, messages);
      sendResponse(md);
    } catch (e) {
      sendResponse(`# ChatGPT Conversation\n\n> Failed to collect: ${e?.message || e}`);
    }
  }
  return true; // async response 허용
});