import { DecoratorNode, EditorConfig, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import { JSX } from 'react';

export interface ImagePayload {
  src: string;
  altText?: string;
  width?: number;
  height?: number;
}

export type SerializedImageNode = Spread<{ src: string; altText: string; width: number; height: number; type: string; version: number }, SerializedLexicalNode>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: number;
  __height: number;

  static getType(): string { return 'image'; }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
  }

  constructor(src: string, altText = '', width = 0, height = 0, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(serializedNode.src, serializedNode.altText, serializedNode.width, serializedNode.height);
  }

  exportJSON(): SerializedImageNode {
    return { src: this.__src, altText: this.__altText, width: this.__width, height: this.__height, type: 'image', version: 1 };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.className = 'editor-image-wrapper';
    return div;
  }

  updateDOM(): boolean { return false; }

  decorate(): JSX.Element {
    return (
      <div style={{ margin: '16px 0', textAlign: 'center' }}>
        <img 
          src={this.__src} 
          alt={this.__altText || 'Image'} 
          style={{ maxWidth: '100%', borderRadius: '12px', maxHeight: '600px' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {this.__altText && <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>{this.__altText}</p>}
      </div>
    );
  }

  isInline(): boolean { return false; }
}
