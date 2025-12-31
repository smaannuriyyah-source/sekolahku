import React, { useEffect, useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getRoot,
    $insertNodes,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $createTextNode,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
    ArrowLeft, Save, Bold, Italic, Underline, Strikethrough,
    Code, Link2, List, ListOrdered, Image, FileCode, Heading1,
    Heading2, Heading3, Quote, Undo, Redo, Loader2
} from 'lucide-react';
import { articlesAPI, categoriesAPI, uploadAPI } from '../services/api';

const theme = {
    paragraph: 'editor-paragraph',
    quote: 'editor-quote',
    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
        h4: 'editor-heading-h4',
        h5: 'editor-heading-h5'
    },
    list: {
        nested: { listitem: 'editor-nested-listitem' },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listitem'
    },
    text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
        strikethrough: 'editor-text-strikethrough',
        code: 'editor-text-code'
    },
    code: 'editor-code',
    link: 'editor-link'
};

function onError(error) {
    console.error(error);
}

const ToolbarPlugin = ({ onImageUpload, onEmbedCode }) => {
    const [editor] = useLexicalComposerContext();

    const formatText = (format) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
    };

    const formatHeading = (headingSize) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(headingSize));
            }
        });
    };

    const formatParagraph = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode('p'));
            }
        });
    };

    const insertList = (listType) => {
        if (listType === 'bullet') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
        } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
        }
    };

    const handleUndo = () => {
        editor.dispatchCommand(UNDO_COMMAND);
    };

    const handleRedo = () => {
        editor.dispatchCommand(REDO_COMMAND);
    };

    const toolbarStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 10
    };

    const buttonStyle = {
        padding: '8px 12px',
        border: '1px solid #D1D5DB',
        borderRadius: '6px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.875rem',
        color: '#374151',
        transition: 'all 0.2s'
    };

    return (
        <div style={toolbarStyle}>
            <button onClick={handleUndo} style={buttonStyle} title="Undo">
                <Undo size={16} />
            </button>
            <button onClick={handleRedo} style={buttonStyle} title="Redo">
                <Redo size={16} />
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#E5E7EB', margin: '0 4px' }} />
            <button onClick={() => formatHeading('h1')} style={buttonStyle} title="Heading 1">
                <Heading1 size={16} /> H1
            </button>
            <button onClick={() => formatHeading('h2')} style={buttonStyle} title="Heading 2">
                <Heading2 size={16} /> H2
            </button>
            <button onClick={() => formatHeading('h3')} style={buttonStyle} title="Heading 3">
                <Heading3 size={16} /> H3
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#E5E7EB', margin: '0 4px' }} />
            <button onClick={() => formatText('bold')} style={buttonStyle} title="Bold">
                <Bold size={16} />
            </button>
            <button onClick={() => formatText('italic')} style={buttonStyle} title="Italic">
                <Italic size={16} />
            </button>
            <button onClick={() => formatText('underline')} style={buttonStyle} title="Underline">
                <Underline size={16} />
            </button>
            <button onClick={() => formatText('strikethrough')} style={buttonStyle} title="Strikethrough">
                <Strikethrough size={16} />
            </button>
            <button onClick={() => formatText('code')} style={buttonStyle} title="Inline Code">
                <Code size={16} />
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#E5E7EB', margin: '0 4px' }} />
            <button onClick={insertLink} style={buttonStyle} title="Insert Link">
                <Link2 size={16} /> Link
            </button>
            <button onClick={() => insertList('bullet')} style={buttonStyle} title="Bullet List">
                <List size={16} />
            </button>
            <button onClick={() => insertList('numbered')} style={buttonStyle} title="Numbered List">
                <ListOrdered size={16} />
            </button>
            <button onClick={onImageUpload} style={buttonStyle} title="Upload Image">
                <Image size={16} /> Image
            </button>
            <button onClick={onEmbedCode} style={buttonStyle} title="Embed Code">
                <FileCode size={16} /> Embed
            </button>
        </div>
    );
};

const OnChangePlugin = ({ onChange }) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const htmlString = $generateHtmlFromNodes(editor, null);
                onChange(htmlString);
            });
        });
    }, [editor, onChange]);

    return null;
};

const LoadContentPlugin = ({ content }) => {
    const [editor] = useLexicalComposerContext();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (content && !isLoaded) {
            editor.update(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(content, 'text/html');
                const nodes = $generateNodesFromDOM(editor, dom);
                $getRoot().clear();
                $getRoot().select();
                $insertNodes(nodes);
            });
            setIsLoaded(true);
        }
    }, [editor, content, isLoaded]);

    return null;
};

// Plugin to allow inserting images at cursor position
// Uses a workaround since Lexical doesn't natively support inline images
const InsertImagePlugin = forwardRef((props, ref) => {
    const [editor] = useLexicalComposerContext();

    useImperativeHandle(ref, () => ({
        insertImage: (imageUrl, altText = 'Image') => {
            editor.update(() => {
                // Create a paragraph with the image as HTML
                // This will be captured by OnChangePlugin when converted to HTML
                const paragraph = $createParagraphNode();

                // We'll use a text marker that will be replaced in the HTML output
                // The actual image rendering happens via CSS and the content display
                const imageMarker = `[IMAGE:${imageUrl}]`;
                const textNode = $createTextNode(imageMarker);
                paragraph.append(textNode);

                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    selection.insertParagraph();
                    selection.insertNodes([paragraph]);
                } else {
                    $getRoot().append(paragraph);
                }
            });

            // After Lexical updates, replace the marker with actual HTML in formData
            // This is done via a workaround in handleContentChange
        }
    }));

    return null;
});

// Custom hook to handle image markers in content
const useImageMarkerHandler = (content, setFormData) => {
    useEffect(() => {
        if (content && content.includes('[IMAGE:')) {
            const processedContent = content.replace(
                /\[IMAGE:([^\]]+)\]/g,
                '<img src="$1" alt="Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: block;" />'
            );
            if (processedContent !== content) {
                setFormData(prev => ({ ...prev, content: processedContent }));
            }
        }
    }, [content, setFormData]);
};

const ArticleEditorPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);
    const insertImageRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        thumbnail: '',
        category_id: '',
        status: 'draft'
    });

    const initialConfig = {
        namespace: 'ArticleEditor',
        theme,
        onError,
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode
        ]
    };

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchArticle();
        }
    }, [id]);

    // Process image markers and convert to HTML img tags
    useImageMarkerHandler(formData.content, setFormData);

    const fetchCategories = async () => {
        try {
            const data = await categoriesAPI.getAll();
            if (data.categories) setCategories(data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchArticle = async () => {
        setLoading(true);
        try {
            const data = await articlesAPI.getById(id);
            if (data.article) {
                setFormData({
                    title: data.article.title,
                    content: data.article.content || '',
                    thumbnail: data.article.thumbnail || '',
                    category_id: data.article.category_id || '',
                    status: data.article.status
                });
            }
        } catch (error) {
            console.error('Failed to fetch article:', error);
            alert('Gagal memuat artikel');
        } finally {
            setLoading(false);
        }
    };

    const handleContentChange = useCallback((html) => {
        setFormData(prev => ({ ...prev, content: html }));
    }, []);

    const handleImageUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Hanya file gambar yang diizinkan');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file maksimal 5MB');
            return;
        }

        setUploading(true);
        try {
            const result = await uploadAPI.uploadImage(file);
            if (result.error) {
                alert('Gagal mengupload gambar: ' + result.error);
                return;
            }

            const imgUrl = result.url;

            // Insert image directly into editor at cursor position
            if (insertImageRef.current) {
                insertImageRef.current.insertImage(imgUrl, file.name);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Gagal mengupload gambar');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleEmbedCode = () => {
        const code = prompt('Paste your embed code (iframe, script, etc.):');
        if (code) {
            setFormData(prev => ({ ...prev, content: prev.content + code }));
            alert('Embed code added!');
        }
    };

    const handleSave = async () => {
        if (!formData.title) {
            alert('Judul artikel wajib diisi');
            return;
        }

        setSaving(true);
        try {
            if (id) {
                await articlesAPI.update(id, formData);
            } else {
                await articlesAPI.create(formData);
            }
            alert('Artikel berhasil disimpan');
            navigate('/dashboard/articles');
        } catch (error) {
            console.error('Failed to save article:', error);
            alert('Gagal menyimpan artikel');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#16A34A' }} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            {/* Hidden file input for image upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
            <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 20 }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Link to="/dashboard/articles" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
                            <ArrowLeft size={20} /> Kembali
                        </Link>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            {id ? 'Edit Artikel' : 'Artikel Baru'}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#16A34A', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: saving ? 0.6 : 1 }}>
                            {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
                            {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </div>
            </header>

            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
                            <input
                                type="text"
                                placeholder="Masukkan judul artikel..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                style={{ width: '100%', fontSize: '2rem', fontWeight: '600', border: 'none', outline: 'none', color: '#111827', boxSizing: 'border-box' }}
                            />
                        </div>
                        <LexicalComposer initialConfig={initialConfig}>
                            <ToolbarPlugin onImageUpload={handleImageUpload} onEmbedCode={handleEmbedCode} />
                            <div style={{ position: 'relative', minHeight: '500px' }}>
                                <RichTextPlugin
                                    contentEditable={
                                        <ContentEditable
                                            style={{
                                                minHeight: '500px',
                                                padding: '24px',
                                                outline: 'none',
                                                fontSize: '1rem',
                                                lineHeight: '1.75',
                                                color: '#374151'
                                            }}
                                        />
                                    }
                                    placeholder={
                                        <div style={{ position: 'absolute', top: '24px', left: '24px', color: '#9CA3AF', pointerEvents: 'none' }}>
                                            Mulai menulis artikel Anda...
                                        </div>
                                    }
                                    ErrorBoundary={LexicalErrorBoundary}
                                />
                                <OnChangePlugin onChange={handleContentChange} />
                                <InsertImagePlugin ref={insertImageRef} />
                                {id && formData.content && <LoadContentPlugin content={formData.content} />}
                                <HistoryPlugin />
                                <AutoFocusPlugin />
                                <LinkPlugin />
                                <ListPlugin />
                                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                            </div>
                        </LexicalComposer>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Status</h3>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.95rem', boxSizing: 'border-box' }}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Kategori</h3>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.95rem', boxSizing: 'border-box' }}
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Thumbnail Upload */}
                        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Thumbnail</h3>
                            <input
                                type="file"
                                ref={thumbnailInputRef}
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    if (!file.type.startsWith('image/')) {
                                        alert('Hanya file gambar yang diizinkan');
                                        return;
                                    }
                                    if (file.size > 5 * 1024 * 1024) {
                                        alert('Ukuran file maksimal 5MB');
                                        return;
                                    }
                                    setUploadingThumbnail(true);
                                    try {
                                        const result = await uploadAPI.uploadImage(file);
                                        if (result.error) {
                                            alert('Gagal mengupload thumbnail: ' + result.error);
                                            return;
                                        }
                                        setFormData(prev => ({ ...prev, thumbnail: result.url }));
                                    } catch (error) {
                                        console.error('Thumbnail upload error:', error);
                                        alert('Gagal mengupload thumbnail');
                                    } finally {
                                        setUploadingThumbnail(false);
                                        e.target.value = '';
                                    }
                                }}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            {formData.thumbnail ? (
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={formData.thumbnail}
                                        alt="Thumbnail"
                                        style={{
                                            width: '100%',
                                            aspectRatio: '16/9',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            marginBottom: '12px'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '28px',
                                            height: '28px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => !uploadingThumbnail && thumbnailInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed #D1D5DB',
                                        borderRadius: '8px',
                                        padding: '30px 20px',
                                        textAlign: 'center',
                                        cursor: uploadingThumbnail ? 'wait' : 'pointer',
                                        backgroundColor: '#F9FAFB',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => !uploadingThumbnail && (e.currentTarget.style.borderColor = '#16A34A')}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                                >
                                    {uploadingThumbnail ? (
                                        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#16A34A', margin: '0 auto' }} />
                                    ) : (
                                        <>
                                            <Image size={32} style={{ color: '#9CA3AF', marginBottom: '8px' }} />
                                            <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: 0 }}>Klik untuk upload thumbnail</p>
                                            <p style={{ color: '#9CA3AF', fontSize: '0.8rem', margin: '4px 0 0' }}>Max 5MB</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .editor-paragraph {
                    margin: 0 0 12px 0;
                }
                
                .editor-heading-h1 {
                    font-size: 2em;
                    font-weight: 700;
                    margin: 16px 0;
                    color: #111827;
                }
                
                .editor-heading-h2 {
                    font-size: 1.5em;
                    font-weight: 700;
                    margin: 14px 0;
                    color: #111827;
                }
                
                .editor-heading-h3 {
                    font-size: 1.25em;
                    font-weight: 600;
                    margin: 12px 0;
                    color: #111827;
                }
                
                .editor-quote {
                    border-left: 4px solid #D1D5DB;
                    padding-left: 16px;
                    margin: 16px 0;
                    color: #6B7280;
                    font-style: italic;
                }
                
                .editor-list-ol, .editor-list-ul {
                    margin: 12px 0;
                    padding-left: 24px;
                }
                
                .editor-listitem {
                    margin: 4px 0;
                }
                
                .editor-text-bold {
                    font-weight: 700;
                }
                
                .editor-text-italic {
                    font-style: italic;
                }
                
                .editor-text-underline {
                    text-decoration: underline;
                }
                
                .editor-text-strikethrough {
                    text-decoration: line-through;
                }
                
                .editor-text-code {
                    background-color: #F3F4F6;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                }
                
                .editor-code {
                    background-color: #1F2937;
                    color: #F9FAFB;
                    padding: 16px;
                    border-radius: 8px;
                    font-family: 'Courier New', monospace;
                    overflow-x: auto;
                    margin: 16px 0;
                }
                
                .editor-link {
                    color: #2563EB;
                    text-decoration: underline;
                    cursor: pointer;
                }
                
                .editor-link:hover {
                    color: #1D4ED8;
                }
            `}</style>
        </div>
    );
};

export default ArticleEditorPage;
