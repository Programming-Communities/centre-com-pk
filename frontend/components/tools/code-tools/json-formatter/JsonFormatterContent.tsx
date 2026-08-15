// components/tools/code-tools/json-formatter/JsonFormatterContent.tsx
export const JsonFormatterContent = {
  title: "JSON Formatter — Beautify, Validate & Minify JSON Online | Free Tool",
  
  introduction: `Our free JSON Formatter is the ultimate tool for developers working with JSON data. Whether you need to beautify messy JSON, validate syntax errors, minify JSON for production, or convert JSON to other formats — our tool handles it all instantly, right in your browser.

JSON (JavaScript Object Notation) has become the universal language of data exchange on the web. APIs, configuration files, databases, and modern web applications all rely on JSON. But reading raw, unformatted JSON is difficult and error-prone. Our JSON Formatter solves this problem by transforming raw JSON into beautifully indented, syntax-highlighted, and easy-to-read code in milliseconds.

Built for developers by developers, this tool supports all modern JSON features including nested objects, arrays, and mixed data types. No registration required, no data leaves your browser.`,
  
  features: [
    "🎨 **Beautify JSON** — Instantly format ugly, minified JSON into clean, readable code with proper 2-space or 4-space indentation and syntax highlighting",
    "✅ **Validate JSON** — Catch syntax errors with exact line numbers and descriptive error messages showing why validation failed and how to fix it",
    "📦 **Minify JSON** — Compress formatted JSON back to minified format (single line) for production use — reduces file size by 40-60% for faster API responses",
    "🔍 **JSON Tree View** — Navigate complex JSON structures with an expandable/collapsible tree view that makes exploring large JSON files intuitive",
    "🔄 **JSON to Other Formats** — Convert your JSON data to CSV, XML, YAML, or SQL INSERT statements with one click",
    "📋 **Copy to Clipboard** — One-click copy buttons for formatted JSON, minified JSON, or converted formats",
    "🌍 **Multilingual** — Available in English, Urdu (JSON فارمیٹر), Hindi (JSON फॉर्मेटर), and Arabic (منسق JSON)",
    "🔒 **100% Private** — All processing happens in your browser; JSON data never leaves your device"
  ],
  
  howToUse: {
    title: "How to Use the JSON Formatter — Step by Step",
    steps: [
      {
        step: 1,
        title: "Paste Your JSON",
        description: "Copy your raw JSON data and paste it into the input area. This could be from an API response, a configuration file, or any JSON source. The formatter auto-detects your input format."
      },
      {
        step: 2,
        title: "Auto-Validation",
        description: "As soon as you paste, the tool automatically validates your JSON. If there are errors, you'll see a red error indicator with exact line numbers telling you where the problem is and how to fix it."
      },
      {
        step: 3,
        title: "Choose Your Format",
        description: "Select your desired output: Beautify (2-space or 4-space indentation with syntax highlighting), Minify (compact single-line format), or Debug (shows character positions for each element)."
      },
      {
        step: 4,
        title: "Explore with Tree View",
        description: "Switch to Tree View mode to interactively explore your JSON. Click to expand/collapse nested objects and arrays. See data types, keys, and values at a glance."
      },
      {
        step: 5,
        title: "Copy or Export",
        description: "Click 'Copy' to copy the formatted JSON to your clipboard, or 'Download' to save as a .json file. Use the converter tab to export as CSV, XML, or SQL."
      }
    ]
  },
  
  useCases: [
    {
      title: "API Development & Debugging",
      description: "When building REST APIs, you often receive raw JSON responses. Our formatter instantly beautifies API responses, making it easy to inspect data structure, check field values, and debug integration issues."
    },
    {
      title: "Database Migration",
      description: "Converting JSON data to SQL INSERT statements for database migration? Our tool's export feature generates properly formatted SQL from your JSON data with correct data type handling."
    },
    {
      title: "Frontend Development",
      description: "Working with React, Vue, or Angular and need to understand complex nested state objects? Beautify your JSON state dumps for quick visual debugging."
    },
    {
      title: "Configuration Management",
      description: "Managing package.json, tsconfig.json, Docker compose files, or CI/CD configurations? Validate syntax before committing to prevent pipeline failures."
    },
    {
      title: "Data Analysis",
      description: "Received a large JSON dataset from an analytics API? Use our Tree View to explore the structure, understand relationships, and identify the data you need."
    }
  ],
  
  technicalDetails: `Our JSON Formatter supports the complete ECMA-404 JSON specification:

• **Supported Data Types**: Strings (with Unicode escape sequences), Numbers (integers and decimals), Booleans (true/false), Null values, Objects ({key: value}), Arrays ([nested]), Whitespace handling (spaces, tabs, newlines)
• **Depth Limit**: Handles JSON up to 100 levels deep (most APIs use 5-10 levels)
• **File Size**: Processes JSON up to 10MB in browser (adequate for 99% of API responses)
• **Encoding**: Full UTF-8 support including emoji and international characters
• **Duplicate Key Detection**: Warns when duplicate keys are found (JSON spec allows but discourages)
• **Trailing Comma Detection**: Identifies trailing commas (valid in ES5+ but not in strict JSON)

The formatter uses recursive descent parsing with positional error tracking for precise validation.`,
  
  competitorComparison: [
    { feature: "Validation Accuracy", ourTool: "✅ Line & column numbers", jsonFormatter: "✅ Good validation", codeBeautify: "⚠️ Basic errors only" },
    { feature: "Tree View", ourTool: "✅ Interactive tree explorer", jsonFormatter: "❌ Not available", codeBeautify: "⚠️ Basic tree" },
    { feature: "Format Conversion (CSV/XML/SQL)", ourTool: "✅ 4 formats", jsonFormatter: "❌ JSON only", codeBeautify: "⚠️ 2 formats" },
    { feature: "Multilingual (Urdu/Hindi/Arabic)", ourTool: "✅ 4 languages", jsonFormatter: "❌ English only", codeBeautify: "❌ English only" },
    { feature: "No Ads", ourTool: "✅ Clean interface", jsonFormatter: "⚠️ Multiple ads", codeBeautify: "⚠️ Heavy ads" },
    { feature: "Privacy (Browser-based)", ourTool: "✅ 100% Private", jsonFormatter: "⚠️ Server processing", codeBeautify: "⚠️ Server processing" }
  ],
  
  proTips: [
    "💡 **JSON vs JavaScript Object**: JSON requires double quotes for keys and string values. Single quotes, trailing commas, and comments are NOT valid in JSON (but are valid in JavaScript). Our validator catches these common mistakes.",
    "💡 **Large JSON Files**: For JSON files over 1MB, use the Minify feature first (reduces file size by ~40%), then Beautify to work with the data. The formatter handles large files efficiently.",
    "💡 **JSON Lines (NDJSON)**: If you're working with JSON Lines format (one JSON object per line), format each line separately. Our tool auto-detects NDJSON format.",
    "💡 **Keyboard Shortcut**: Press Ctrl+Enter (Cmd+Enter on Mac) to format JSON instantly without clicking. Press Ctrl+Shift+M to minify."
  ],
  
  faqs: [
    {
      question: "What's the difference between JSON and JavaScript Object?",
      answer: "JSON (JavaScript Object Notation) is a strict data format requiring double quotes around keys and string values. JavaScript objects allow single quotes, unquoted keys, trailing commas, and comments. JSON is designed for data exchange; JavaScript objects are programming constructs."
    },
    {
      question: "Why does my JSON validation fail?",
      answer: "Common JSON errors include: using single quotes instead of double quotes, trailing commas after the last item in objects/arrays, missing closing brackets/braces, unquoted property keys, and using undefined instead of null. Our validator identifies the exact error with line numbers."
    },
    {
      question: "Is my JSON data safe?",
      answer: "Completely safe! All processing happens in your browser using JavaScript. Your JSON data never leaves your device, is never transmitted to our servers, and is never stored anywhere. You can verify this by using our tool offline."
    },
    {
      question: "Can I convert JSON to CSV or SQL?",
      answer: "Yes! Use the 'Export' feature to convert structured JSON arrays into CSV format (for spreadsheets/Excel) or SQL INSERT statements (for database import). The converter handles nested objects by flattening them into columns."
    },
    {
      question: "What's the maximum file size supported?",
      answer: "Our browser-based tool handles JSON up to 10MB comfortably (most API responses are under 1MB). For larger files, we recommend using our minify feature first to reduce size before formatting."
    }
  ],
  
  relatedTools: [
    { name: "HTML Formatter", slug: "html-formatter", description: "Beautify HTML code" },
    { name: "CSS Formatter", slug: "css-formatter", description: "Format CSS stylesheets" },
    { name: "JavaScript Formatter", slug: "javascript-formatter", description: "Beautify JS code" },
    { name: "XML Formatter", slug: "xml-formatter", description: "Format XML documents" }
  ]
};