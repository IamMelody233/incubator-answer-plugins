import { useEffect, useState } from 'react';
import hljs from 'highlight.js';

// 创建一个样式映射
const themeStyles = {
  github: {
    light: () => import('highlight.js/styles/github.css?inline'),
    dark: () => import('highlight.js/styles/github-dark.css?inline'),
  },
  a11y: {
    light: () => import('highlight.js/styles/a11y-light.css?inline'),
    dark: () => import('highlight.js/styles/a11y-dark.css?inline'),
  },
  default: {
    light: () => import('highlight.js/styles/default.css?inline'),
    dark: () => import('highlight.js/styles/dark.css?inline'),
  },
  atom: {
    light: () => import('highlight.js/styles/atom-one-light.css?inline'),
    dark: () => import('highlight.js/styles/atom-one-dark.css?inline'),
  },
  isbl: {
    light: () => import('highlight.js/styles/isbl-editor-light.css?inline'),
    dark: () => import('highlight.js/styles/isbl-editor-dark.css?inline'),
  },
  kimbie: {
    light: () => import('highlight.js/styles/kimbie-light.css?inline'),
    dark: () => import('highlight.js/styles/kimbie-dark.css?inline'),
  },
  nnfx: {
    light: () => import('highlight.js/styles/nnfx-light.css?inline'),
    dark: () => import('highlight.js/styles/nnfx-dark.css?inline'),
  },
  panda: {
    light: () => import('highlight.js/styles/panda-syntax-light.css?inline'),
    dark: () => import('highlight.js/styles/panda-syntax-dark.css?inline'),
  },
  paraiso: {
    light: () => import('highlight.js/styles/paraiso-light.css?inline'),
    dark: () => import('highlight.js/styles/paraiso-dark.css?inline'),
  },
  qtcreator: {
    light: () => import('highlight.js/styles/qtcreator-light.css?inline'),
    dark: () => import('highlight.js/styles/qtcreator-dark.css?inline'),
  },
  stackoverflow: {
    light: () => import('highlight.js/styles/stackoverflow-light.css?inline'),
    dark: () => import('highlight.js/styles/stackoverflow-dark.css?inline'),
  },
  tokiyo: {
    light: () => import('highlight.js/styles/tokyo-night-light.css?inline'),
    dark: () => import('highlight.js/styles/tokyo-night-dark.css?inline'),
  },
};

const useHighlightCode = (element: HTMLElement | null) => {
  const [selectTheme, setSelectTheme] = useState<string>('default');

  // Fetch theme from API
  useEffect(() => {
    fetch('/answer/api/v1/render/config')
      .then((response) => response.json())
      .then((result) => {
        console.log('Fetched theme:', result.data.select_theme);
        setSelectTheme(result.data.select_theme);
      })
      .catch((error) => {
        console.error('Error fetching theme:', error);
      });
  }, []);

  useEffect(() => {
    if (!element) return;

    const applyThemeCSS = async (theme: string) => {
      const existingStyleElement = document.querySelector('style[data-theme-style="highlight"]');
      if (existingStyleElement) existingStyleElement.remove();

      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-theme-style', 'highlight');
      document.head.appendChild(styleElement);

      const themeMode = theme === 'dark' ? 'dark' : 'light';
      const selectedTheme = themeStyles[selectTheme] || themeStyles.default;

      // 动态导入对应的样式
      const css = await selectedTheme[themeMode]();
      styleElement.innerHTML = css.default;

      // 应用高亮
      element.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    };

    // 获取并应用初始主题
    const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
    applyThemeCSS(currentTheme);

    // 监听 DOM 变化（比如代码块内容变动）
    const contentObserver = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
      console.log('检测到代码内容变化，重新应用代码高亮, 当前主题:', newTheme);
      applyThemeCSS(newTheme);
    });

    contentObserver.observe(element, {
      childList: true, // 监视子元素的变化
      subtree: true,   // 监视整个子树
    });

    // 监听主题变化
    const themeObserver = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
      console.log('检测到主题变化:', newTheme);
      applyThemeCSS(newTheme);
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-bs-theme'],
    });

    return () => {
      contentObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [element, selectTheme]);

  return null;
};

export { useHighlightCode };
