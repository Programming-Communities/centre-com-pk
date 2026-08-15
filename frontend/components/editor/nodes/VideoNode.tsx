import { DecoratorNode, EditorConfig, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import { JSX } from 'react';

export type SerializedVideoNode = Spread<{ src: string; videoType: string; width: number; height: number; type: string; version: number }, SerializedLexicalNode>;

export class VideoNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __videoType: string;
  __width: number;
  __height: number;

  static getType(): string { return 'video'; }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__src, node.__videoType, node.__width, node.__height, node.__key);
  }

  constructor(src: string, videoType = 'video/mp4', width = 0, height = 0, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__videoType = videoType;
    this.__width = width;
    this.__height = height;
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    return new VideoNode(serializedNode.src, serializedNode.videoType, serializedNode.width, serializedNode.height);
  }

  exportJSON(): SerializedVideoNode {
    return { src: this.__src, videoType: this.__videoType, width: this.__width, height: this.__height, type: 'video', version: 1 };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.className = 'editor-video-wrapper';
    return div;
  }

  updateDOM(): boolean { return false; }

  isInline(): boolean { return false; }

  decorate(): JSX.Element {
    const isYouTube = this.__src.includes('youtube.com') || this.__src.includes('youtu.be');
    
    if (isYouTube) {
      const videoId = this.__src.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/)?.[1];
      return (
        <div style={{ position: 'relative', paddingTop: '56.25%', margin: '16px 0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId || ''}`}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <div style={{ margin: '16px 0', textAlign: 'center' }}>
        <video 
          controls 
          style={{ maxWidth: '100%', borderRadius: '12px', maxHeight: '500px' }}
          poster="/video-poster.png"
        >
          <source src={this.__src} type={this.__videoType} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
}
