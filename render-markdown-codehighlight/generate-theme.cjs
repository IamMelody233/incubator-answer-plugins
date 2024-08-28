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

themes.forEach(file => {
  const themeName = file.replace('.css', '');
  const [base, variant] = themeName.split('-');

  if (!themeMap[base]) {
    themeMap[base] = {};
  }

  if (variant === 'light' || variant === 'dark') {
    themeMap[base][variant] = `() => import('highlight.js/styles/${file}?inline')`;
  } else {
    themeMap[base].light = `() => import('highlight.js/styles/${themeName}.css?inline')`;
    themeMap[base].dark = `() => import('highlight.js/styles/${themeName}.css?inline')`;
  }

  // 添加主题名称到主题列表中
  if (!themeList.includes(base)) {
    themeList.push(base);
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
