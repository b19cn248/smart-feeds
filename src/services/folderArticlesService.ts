// src/services/folderArticlesService.ts
import { FoldersWithArticlesResponse, FolderDetailWithArticlesResponse } from '../types/folderArticles.types';
import { apiClient } from './apiClient';

export const folderArticlesService = {
    /**
     * Lấy danh sách folders kèm articles
     * @param page Số trang hiện tại, bắt đầu từ 0
     * @param size Số lượng folders trên mỗi trang
     * @param sort Thuộc tính và hướng sắp xếp, mặc định là createdAt,DESC
     * @param article_size Số lượng articles hiển thị cho mỗi folder
     */
    getFoldersWithArticles: async (
        page = 0,
        size = 20,
        sort = 'createdAt,DESC',
        article_size = 5
    ): Promise<FoldersWithArticlesResponse> => {
        return apiClient.get<FoldersWithArticlesResponse>(
            `/folders/with-articles?page=${page}&size=${size}&sort=${sort}&article_size=${article_size}`
        );
    },

    /**
     * Lấy chi tiết folder kèm articles có phân trang
     * @param folderId ID của folder
     * @param page Số trang hiện tại cho danh sách articles, bắt đầu từ 0
     * @param size Số lượng articles trên mỗi trang
     * @param sort Thuộc tính và hướng sắp xếp, mặc định là publishDate,DESC
     */
    getFolderDetailWithArticles: async (
        folderId: number,
        page = 0,
        size = 20,
        sort = 'pubDate,DESC'
    ): Promise<FolderDetailWithArticlesResponse> => {
        return apiClient.get<FolderDetailWithArticlesResponse>(
            `/folders/${folderId}/articles?page=${page}&size=${size}&sort=${sort}`
        );
    }
};