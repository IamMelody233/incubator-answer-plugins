import { useEffect, useState } from 'react';
import hljs from 'highlight.js';

import githubLightCss from 'highlight.js/styles/github.css?inline';
import githubDarkCss from 'highlight.js/styles/github-dark.css?inline';
import a11yLightCss from 'highlight.js/styles/a11y-light.css?inline';
import a11yDarkCss from 'highlight.js/styles/a11y-dark.css?inline';
import defaultLightCss from 'highlight.js/styles/default.css?inline';
import defaultDarkCss from 'highlight.js/styles/dark.css?inline';
import AtomLightCss from 'highlight.js/styles/atom-one-light.css?inline';
import AtomDarkCss from 'highlight.js/styles/atom-one-dark.css?inline';
import IsblLightCss from 'highlight.js/styles/isbl-editor-light.css?inline';
import IsblDarkCss from 'highlight.js/styles/isbl-editor-dark.css?inline';
import KimbieLightCss from 'highlight.js/styles/kimbie-light.css?inline';
import KimbieDarkCss from 'highlight.js/styles/kimbie-dark.css?inline';
import NnfxLightCss from 'highlight.js/styles/nnfx-light.css?inline';
import NnfxDarkCss from 'highlight.js/styles/nnfx-dark.css?inline';
import PandaLightCss from 'highlight.js/styles/panda-syntax-light.css?inline';
import PandaDarkCss from 'highlight.js/styles/panda-syntax-dark.css?inline';
import ParaisoLightCss from 'highlight.js/styles/paraiso-light.css?inline';
import ParaisoDarkCss from 'highlight.js/styles/paraiso-dark.css?inline';
import QtcreatorLightCss from 'highlight.js/styles/qtcreator-light.css?inline';
import QtcreatorDarkCss from 'highlight.js/styles/qtcreator-dark.css?inline';
import StackoverflowLightCss from 'highlight.js/styles/stackoverflow-light.css?inline';
import StackoverflowDarkCss from 'highlight.js/styles/stackoverflow-dark.css?inline';
import TokiyoLightCss from 'highlight.js/styles/tokyo-night-light.css?inline';
import TokiyoDarkCss from 'highlight.js/styles/tokyo-night-dark.css?inline';




const useHighlightCode = (element: HTMLElement | null) => {
  const [selectTheme, setSelectTheme] = useState<string>('default');

  useEffect(() => {
    fetch('/answer/api/v1/render/config')
      .then((response) => response.json())
      .then((result) => {
        console.log('Fetched theme:', result.data.select_theme);
        setSelectTheme(result.data.select_theme);  // 只传递 select_theme 的值
      })
      .catch((error) => {
        console.error('Error fetching theme:', error);
      });
  }, []);  // 保持空依赖，避免无限循环
  

  useEffect(() => {
    if (!element) return;
    console.log('Theme selected:', selectTheme);

    const applyThemeCSS = (theme: string) => {
      const existingStyleElement = document.querySelector('style[data-theme-style="highlight"]');
      if (existingStyleElement) {
        existingStyleElement.remove();
      }

      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-theme-style', 'highlight');
      document.head.appendChild(styleElement);

      if (selectTheme === 'github') {
        styleElement.innerHTML = theme === 'dark' ? githubDarkCss : githubLightCss;
      } 
      else if (selectTheme === 'a11y') {
        styleElement.innerHTML = theme === 'dark' ? a11yDarkCss : a11yLightCss;
      } 
      else if (selectTheme === 'default'){
        styleElement.innerHTML = theme === 'dark' ? defaultDarkCss : defaultLightCss;
      }
      else if (selectTheme === 'atom'){
        styleElement.innerHTML = theme === 'dark' ? AtomDarkCss : AtomLightCss;
      }
      else if (selectTheme === 'isbl'){
        styleElement.innerHTML = theme === 'dark' ? IsblDarkCss : IsblLightCss;
      }
      else if (selectTheme === 'kimbie'){
        styleElement.innerHTML = theme === 'dark' ? KimbieDarkCss : KimbieLightCss;
      }
      else if (selectTheme === 'nnfx'){
        styleElement.innerHTML = theme === 'dark' ? NnfxDarkCss : NnfxLightCss;
      }
      else if (selectTheme === 'panda'){
        styleElement.innerHTML = theme === 'dark' ? PandaDarkCss : PandaLightCss;
      }
      else if (selectTheme === 'paraiso'){
        styleElement.innerHTML = theme === 'dark' ? ParaisoDarkCss : ParaisoLightCss;
      }
      else if (selectTheme === 'qtcreator'){
        styleElement.innerHTML = theme === 'dark' ? QtcreatorDarkCss : QtcreatorLightCss;
      }
      else if (selectTheme === 'stackoverflow'){
        styleElement.innerHTML = theme === 'dark' ? StackoverflowDarkCss : StackoverflowLightCss;
      }
      else if (selectTheme === 'tokiyo'){
        styleElement.innerHTML = theme === 'dark' ? TokiyoDarkCss : TokiyoLightCss;
      }

      else {
        styleElement.innerHTML = theme === 'dark' ? defaultDarkCss : defaultLightCss;
      }


      element.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    };

    const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
    applyThemeCSS(currentTheme);

    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
      applyThemeCSS(newTheme);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });

    return () => {
      observer.disconnect();
    };
  }, [element, selectTheme]);  // Keep selectTheme as a dependency to trigger re-render when it changes

  return null;
};

export { useHighlightCode };
