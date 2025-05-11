// src/hooks/useArticleImage.ts
import { useState, useEffect } from 'react';
import { Article } from '../types';
import { FolderArticle } from '../types/folderArticles.types';

/**
 * Custom hook để kiểm tra xem ảnh đã xuất hiện trong nội dung bài viết chưa
 * để tránh hiển thị trùng lặp
 */
export const useArticleImage = (article: Article | FolderArticle | null) => {
    const [imageInContent, setImageInContent] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        if (!article || !article.image_url) {
            setImageInContent(false);
            setImageSrc(null);
            return;
        }

        // Lưu lại image_url để tham chiếu
        setImageSrc(article.image_url);

        // Kiểm tra xem ảnh có trong nội dung không
        const content = article.content_encoded || article.content;

        try {
            // Phân tích HTML để kiểm tra các thẻ img
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const imgElements = doc.querySelectorAll('img');

            // Các biến thể URL có thể có
            const imageUrl = article.image_url.trim();
            const urlWithoutProtocol = imageUrl.replace(/^https?:\/\//, '');
            const urlWithoutQuery = imageUrl.split('?')[0];
            const fileNameMatch = imageUrl.match(/\/([^\/]+)$/);
            const fileName = fileNameMatch ? fileNameMatch[1] : '';

            // Kiểm tra xem có thẻ img nào chứa URL tương tự không
            let foundInContent = false;

            imgElements.forEach(img => {
                const src = img.getAttribute('src');
                if (!src) return;

                if (
                    src === imageUrl ||
                    src.includes(urlWithoutProtocol) ||
                    src.includes(urlWithoutQuery) ||
                    (fileName && src.includes(fileName))
                ) {
                    foundInContent = true;
                }
            });

            setImageInContent(foundInContent);

        } catch (error) {
            console.error('Error checking image in content:', error);
            setImageInContent(false);
        }
    }, [article]);

    return {
        shouldShowFeaturedImage: !imageInContent && !!imageSrc,
        imageSrc
    };
};