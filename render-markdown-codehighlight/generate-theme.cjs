const fs = require('fs');
const path = require('path');

const stylesDir = path.resolve(__dirname, 'node_modules/highlight.js/styles');
const jsOutputFile = path.resolve(__dirname, 'themeStyles.js');
const goOutputFile = path.resolve(__dirname, 'theme_list.go');

// 读取样式目录下的所有 CSS 文件
const themes = fs.readdirSync(stylesDir).filter(file => file.endsWith('.css'));

// 分组存储主题，按命名规则自动分类
const themeMap = {};
const themeList = [];
let defaultDarkTheme = null;

themes.forEach(file => {
  const themeName = file.replace('.css', '');
  const [base, ...variantParts] = themeName.split('-');
  const variant = variantParts.join('-');

    // 排除干扰项
    if (themeName === 'dark' || themeName === 'dark.min') {
      return;
    }

  if (!themeMap[base]) {
    themeMap[base] = {};
  }

    if (variant.includes('light')) {
      // 如果已经存在同类主题，选择较短的名称
      if (!themeMap[base].light || themeMap[base].light.length > file.length) {
        themeMap[base].light = `() => import('highlight.js/styles/${file}?inline')`;
      }
    } else if (variant.includes('dark')) {
      // 如果已经存在同类主题，选择较短的名称
      if (!themeMap[base].dark || themeMap[base].dark.length > file.length) {
        themeMap[base].dark = `() => import('highlight.js/styles/${file}?inline')`;
        // 记录第一个识别到的 dark 主题作为默认主题
        if (!defaultDarkTheme) {
          defaultDarkTheme = themeMap[base].dark;
        }
      }
    } else {
      // 默认视为light主题
      if (!themeMap[base].light || themeMap[base].light.length > file.length) {
        themeMap[base].light = `() => import('highlight.js/styles/${file}?inline')`;
      }
    }
  
  // 添加主题名称到主题列表中
  if (!themeList.includes(base)) {
    themeList.push(base);
  }
});

// 添加默认的dark主题给没有dark主题的base
Object.keys(themeMap).forEach(base => {
  if (!themeMap[base].dark && defaultDarkTheme) {
    themeMap[base].dark = defaultDarkTheme;
  }
});

// 生成 themeStyles.js 文件
const jsOutput = `export const themeStyles = {\n${Object.entries(themeMap)
  .map(([theme, variants]) => 
    `  ${JSON.stringify(theme)}: {\n    light: ${variants.light},\n    dark: ${variants.dark}\n  }`
  ).join(',\n')}\n};`;

fs.writeFileSync(jsOutputFile, jsOutput);

// 生成 theme_list.go 文件
const goOutput = `
package render_markdown_codehighlight

var ThemeList = []string{
  ${themeList.map(theme => `"${theme}"`).join(",\n  ")},
}
`;
fs.writeFileSync(goOutputFile, goOutput);

console.log('Theme styles and Go theme list generated successfully!');
