'use client';

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// Simple markdown parser function
function parseMarkdown(md: string) {
  // Process headings
  let html = md.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Process bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Process links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline">$1</a>');
  
  // Process code blocks
  html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
  
  // Process lists
  html = html.replace(/^\s*\*\s(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n)+/g, '<ul class="list-disc pl-5 my-2">$&</ul>');
  
  // Process paragraphs (only if not inside a component tag)
  const lines = html.split('\n');
  let inComponent = false;
  let result = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('<Alert') || line.includes('<Button') || line.includes('<Card') || line.includes('<Tabs')) {
      inComponent = true;
      result += line + '\n';
    } else if (inComponent && (line.includes('</Alert>') || line.includes('</Button>') || line.includes('</Card>') || line.includes('</Tabs>'))) {
      inComponent = false;
      result += line + '\n';
    } else if (!inComponent && line.trim() && !line.startsWith('<')) {
      result += `<p>${line}</p>\n`;
    } else {
      result += line + '\n';
    }
  }
  
  return result;
}

// Parse component syntax to actual React components
function parseComponentSyntax(content: string) {
  // Replace Alert component syntax with actual component
  content = content.replace(
    /<Alert([^>]*)>([\s\S]*?)<\/Alert>/g,
    (match, props, children) => {
      const variant = props.includes('variant="destructive"') ? 'destructive' : 'default';
      
      return `
        <div class="my-4">
          <Alert variant="${variant}">
            ${children.includes('<AlertTitle>') ? '' : `<AlertTitle>Note</AlertTitle>`}
            ${children}
          </Alert>
        </div>
      `;
    }
  );
  
  // Replace Button component syntax with actual component
  content = content.replace(
    /<Button([^>]*)>([\s\S]*?)<\/Button>/g,
    (match, props, children) => {
      const variant = props.includes('variant=') 
        ? props.match(/variant="([^"]+)"/)?.[1] || 'default' 
        : 'default';
      
      return `
        <div class="my-2">
          <Button variant="${variant}">${children}</Button>
        </div>
      `;
    }
  );
  
  // Replace Card component syntax with actual component
  content = content.replace(
    /<Card([^>]*)>([\s\S]*?)<\/Card>/g,
    (match, props, children) => {
      return `
        <div class="my-4">
          <Card>
            ${children}
          </Card>
        </div>
      `;
    }
  );
  
  // Replace CardHeader component syntax
  content = content.replace(
    /<CardHeader([^>]*)>([\s\S]*?)<\/CardHeader>/g,
    (match, props, children) => {
      return `<CardHeader>${children}</CardHeader>`;
    }
  );
  
  // Replace CardTitle component syntax
  content = content.replace(
    /<CardTitle([^>]*)>([\s\S]*?)<\/CardTitle>/g,
    (match, props, children) => {
      return `<CardTitle>${children}</CardTitle>`;
    }
  );
  
  // Replace CardDescription component syntax
  content = content.replace(
    /<CardDescription([^>]*)>([\s\S]*?)<\/CardDescription>/g,
    (match, props, children) => {
      return `<CardDescription>${children}</CardDescription>`;
    }
  );
  
  // Replace CardContent component syntax
  content = content.replace(
    /<CardContent([^>]*)>([\s\S]*?)<\/CardContent>/g,
    (match, props, children) => {
      return `<CardContent>${children}</CardContent>`;
    }
  );
  
  // Replace CardFooter component syntax
  content = content.replace(
    /<CardFooter([^>]*)>([\s\S]*?)<\/CardFooter>/g,
    (match, props, children) => {
      return `<CardFooter>${children}</CardFooter>`;
    }
  );
  
  // Replace Tabs component syntax
  content = content.replace(
    /<Tabs([^>]*)>([\s\S]*?)<\/Tabs>/g,
    (match, props, children) => {
      const defaultValue = props.match(/defaultValue="([^"]+)"/)?.[1] || 'tab1';
      
      return `
        <div class="my-4">
          <Tabs defaultValue="${defaultValue}">
            ${children}
          </Tabs>
        </div>
      `;
    }
  );
  
  return content;
}

// MDX Demo component
export default function MDXDemo() {
  const [mdxContent, setMdxContent] = useState<string>(`# Welcome to MDX Demo

This is a **simple** demonstration of our *MDX* parser.

## Features

* Renders markdown content
* Supports shadcn UI components
* Live preview

## Example Components

<Alert>
  <AlertTitle>Important Information</AlertTitle>
  <AlertDescription>This is a standard alert component from shadcn/ui.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>This is a destructive alert component.</AlertDescription>
</Alert>

<Button>Click Me</Button>

<Button variant="outline">Outline Button</Button>

<Card>
  <CardHeader>
    <CardTitle>Card Example</CardTitle>
    <CardDescription>This is a card component from shadcn/ui.</CardDescription>
  </CardHeader>
  <CardContent>
    You can use this component in your MDX content.
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
</Tabs>
`);

  // Process the MDX content
  const processedContent = (() => {
    try {
      let processed = parseMarkdown(mdxContent);
      processed = parseComponentSyntax(processed);
      return { __html: processed };
    } catch (error) {
      console.error("Error processing MDX:", error);
      return { __html: "<p>Error processing MDX content</p>" };
    }
  })();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">MDX Parser Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Edit MDX</h2>
          <Textarea 
            value={mdxContent}
            onChange={(e) => setMdxContent(e.target.value)}
            className="h-96 font-mono"
            placeholder="Enter your MDX content here..."
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Preview</h2>
          <div className="border rounded-md p-4 bg-white min-h-96">
            <div dangerouslySetInnerHTML={processedContent} />
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-50 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Usage Instructions</h2>
        <p className="mb-2">You can use regular Markdown syntax along with shadcn/ui components:</p>
        <ul className="list-disc pl-5">
          <li>Use regular markdown for headings (#, ##, ###), emphasis (**, *), lists, and links</li>
          <li>Use shadcn/ui component syntax to include components like Alert, Button, Card, etc.</li>
          <li>Components are defined using XML-like syntax: <code className="bg-gray-100 px-1 rounded">&lt;Alert&gt;...&lt;/Alert&gt;</code></li>
        </ul>
      </div>
    </div>
  );
}