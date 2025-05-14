// src/pages/TeamBoardDetailPage/TeamBoardDetailPage.tsx
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useNavigate, useParams} from 'react-router-dom';
import {useTeamBoard} from '../../contexts/TeamBoardContext';
import {useTeam} from '../../contexts/TeamContext';
import {useAuth} from '../../contexts/AuthContext';
import {Button} from '../../components/common/Button';
import {Modal} from '../../components/common/Modal';
import {LoadingScreen} from '../../components/common/LoadingScreen';
import {
    ShareBoardForm,
    TeamBoardForm,
    TeamMemberList,
    UpdatePermissionForm // Thêm import UpdatePermissionForm
} from '../../components/features/teamBoard';
import { TeamBoardUser } from '../../types'; // Thêm import TeamBoardUser

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;

    @media (max-width: ${({theme}) => theme.breakpoints.sm}) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const TitleSection = styled.div`
    flex: 1;
`;

const PageTitle = styled.h1`
    font-size: ${({theme}) => theme.typography.fontSize['3xl']};
    font-weight: ${({theme}) => theme.typography.fontWeight.bold};
    color: ${({theme}) => theme.colors.text.primary};
    margin: 0 0 4px 0;
`;

const TeamInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({theme}) => theme.colors.text.secondary};
    font-size: ${({theme}) => theme.typography.fontSize.md};
`;

const Description = styled.p`
    color: ${({theme}) => theme.colors.text.secondary};
    margin: 16px 0;
    max-width: 800px;
    line-height: 1.6;
`;

const Actions = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
`;

const TabsContainer = styled.div`
    margin-bottom: 24px;
    border-bottom: 1px solid ${({theme}) => theme.colors.gray[200]};
`;

const TabButton = styled.button<{ active: boolean }>`
    padding: 12px 16px;
    background: none;
    border: none;
    font-size: ${({theme}) => theme.typography.fontSize.md};
    font-weight: ${({
                        active,
                        theme
                    }) => active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
    color: ${({active, theme}) => active ? theme.colors.primary.main : theme.colors.text.secondary};
    cursor: pointer;
    position: relative;
    transition: ${({theme}) => theme.transitions.default};

    &:after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 3px;
        background-color: ${({active, theme}) => active ? theme.colors.primary.main : 'transparent'};
        transition: ${({theme}) => theme.transitions.default};
    }

    &:hover {
        color: ${({active, theme}) => active ? theme.colors.primary.main : theme.colors.text.primary};
    }
`;

const SectionTitle = styled.h2`
    font-size: ${({theme}) => theme.typography.fontSize.xl};
    font-weight: ${({theme}) => theme.typography.fontWeight.semibold};
    color: ${({theme}) => theme.colors.text.primary};
    margin: 32px 0 16px;
`;

const ArticlesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 24px;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 48px 0;
    background-color: ${({theme}) => theme.colors.background.secondary};
    border-radius: ${({theme}) => theme.radii.lg};
    margin-top: 24px;
`;

const EmptyStateIcon = styled.div`
    font-size: 48px;
    color: ${({theme}) => theme.colors.gray[400]};
    margin-bottom: 16px;
`;

const EmptyStateText = styled.p`
    font-size: ${({theme}) => theme.typography.fontSize.lg};
    color: ${({theme}) => theme.colors.text.secondary};
    margin-bottom: 24px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
`;

type TabType = 'articles' | 'members';

export const TeamBoardDetailPage: React.FC = () => {
    const {boardId} = useParams<{ boardId: string }>();
    const navigate = useNavigate();
    const {user} = useAuth();
    const {
        teamBoardDetail,
        isLoading,
        error,
        fetchTeamBoardDetail,
        updateTeamBoard,
        deleteTeamBoard,
        shareTeamBoard,
        removeArticleFromTeamBoard,
        // Thêm hai phương thức mới từ context
        updateMemberPermission,
        removeMember
    } = useTeamBoard();
    const {teams} = useTeam();

    // Local state
    const [activeTab, setActiveTab] = useState<TabType>('articles');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    // Thêm state cho quản lý quyền và xóa thành viên
    const [showUpdatePermissionModal, setShowUpdatePermissionModal] = useState(false);
    const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamBoardUser | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch board details on mount and when ID changes
    useEffect(() => {
        if (boardId) {
            fetchTeamBoardDetail(parseInt(boardId));
        }
    }, [boardId, fetchTeamBoardDetail]);

    // Handle board update
    const handleUpdateBoard = async (name: string, description: string, teamId: number) => {
        if (!boardId) return;

        setIsSubmitting(true);
        const updatedBoard = await updateTeamBoard(parseInt(boardId), name, description, teamId);
        setIsSubmitting(false);

        if (updatedBoard) {
            setShowEditModal(false);
        }
    };

    // Handle board deletion
    const handleDeleteBoard = async () => {
        if (!boardId) return;

        setIsSubmitting(true);
        const success = await deleteTeamBoard(parseInt(boardId));
        setIsSubmitting(false);

        if (success) {
            setShowDeleteModal(false);
            navigate('/team-boards');
        }
    };

    // Handle sharing
    const handleShareBoard = async (email: string, permission: string) => {
        if (!boardId) return;

        setIsSubmitting(true);
        const success = await shareTeamBoard(parseInt(boardId), email, permission);
        setIsSubmitting(false);

        if (success) {
            setShowShareModal(false);
        }
    };

    // Handle article removal
    const handleRemoveArticle = async (articleId: number) => {
        if (!boardId) return;
        await removeArticleFromTeamBoard(parseInt(boardId), articleId);
    };

    // Thêm handler cập nhật quyền
    const handleEditPermission = (userId: number) => {
        if (!teamBoardDetail) return;

        const member = teamBoardDetail.members.find(m => m.user_id === userId);
        if (member) {
            setSelectedMember(member);
            setShowUpdatePermissionModal(true);
        }
    };

    // Thêm handler xóa thành viên
    const handleRemoveMember = (userId: number) => {
        if (!teamBoardDetail) return;

        const member = teamBoardDetail.members.find(m => m.user_id === userId);
        if (member) {
            setSelectedMember(member);
            setShowRemoveMemberModal(true);
        }
    };

    // Thêm handler cập nhật quyền
    const handleUpdatePermission = async (userId: number, email: string, permission: string) => {
        if (!boardId) return;

        setIsSubmitting(true);
        const success = await updateMemberPermission(parseInt(boardId), userId, email, permission);
        setIsSubmitting(false);

        if (success) {
            setShowUpdatePermissionModal(false);
            setSelectedMember(null);
        }
    };

    // Thêm handler xác nhận xóa thành viên
    const handleConfirmRemoveMember = async () => {
        if (!boardId || !selectedMember) return;

        setIsSubmitting(true);
        const success = await removeMember(parseInt(boardId), selectedMember.user_id);
        setIsSubmitting(false);

        if (success) {
            setShowRemoveMemberModal(false);
            setSelectedMember(null);
        }
    };

    // Check if user has edit permission
    const hasEditPermission = teamBoardDetail?.user_permission === 'EDIT' ||
        teamBoardDetail?.user_permission === 'ADMIN';

    if (isLoading && !teamBoardDetail) {
        return <LoadingScreen/>;
    }

    if (error || !teamBoardDetail) {
        return (
            <div>
                <h2>Error</h2>
                <p>{error || 'Team board not found'}</p>
                <Button onClick={() => navigate('/team-boards')}>
                    Back to Team Boards
                </Button>
            </div>
        );
    }

    return (
        <>
            <PageHeader>
                <TitleSection>
                    <PageTitle>{teamBoardDetail.name}</PageTitle>
                    <TeamInfo>
                        <i className="fas fa-users"></i>
                        {teamBoardDetail.team_name}
                    </TeamInfo>
                    <Description>
                        {teamBoardDetail.description || 'No description provided'}
                    </Description>
                </TitleSection>

                <Actions>
                    {hasEditPermission && (
                        <>
                            <Button onClick={() => setShowShareModal(true)} leftIcon="share-alt">
                                Share
                            </Button>
                            <Button onClick={() => setShowEditModal(true)} leftIcon="edit">
                                Edit
                            </Button>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(true)} leftIcon="trash">
                                Delete
                            </Button>
                        </>
                    )}
                </Actions>
            </PageHeader>

            <TabsContainer>
                <TabButton
                    active={activeTab === 'articles'}
                    onClick={() => setActiveTab('articles')}
                >
                    Articles
                </TabButton>
                <TabButton
                    active={activeTab === 'members'}
                    onClick={() => setActiveTab('members')}
                >
                    Members ({teamBoardDetail.members.length})
                </TabButton>
            </TabsContainer>

            {activeTab === 'articles' && (
                <>
                    <SectionTitle>Articles</SectionTitle>

                    {teamBoardDetail.articles.content.length === 0 ? (
                        <EmptyState>
                            <EmptyStateIcon>
                                <i className="fas fa-newspaper"></i>
                            </EmptyStateIcon>
                            <EmptyStateText>
                                No articles yet. Start adding articles to this board.
                            </EmptyStateText>
                            {hasEditPermission && (
                                <Button leftIcon="plus">
                                    Add Article
                                </Button>
                            )}
                        </EmptyState>
                    ) : (
                        <ArticlesGrid>
                            {teamBoardDetail.articles.content.map(article => (
                                <div key={article.id}>
                                    <h3>{article.title}</h3>
                                    <p>{article.summary}</p>
                                    {hasEditPermission && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            leftIcon="times"
                                            onClick={() => handleRemoveArticle(article.id)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </ArticlesGrid>
                    )}
                </>
            )}

            {activeTab === 'members' && (
                <>
                    <SectionTitle>Members</SectionTitle>

                    <TeamMemberList
                        members={teamBoardDetail.members}
                        currentUserId={user?.id}
                        // Thêm handlers cho cập nhật quyền và xóa thành viên
                        onEditPermission={hasEditPermission ? handleEditPermission : undefined}
                        onRemoveMember={hasEditPermission ? handleRemoveMember : undefined}
                    />
                </>
            )}

            {/* Edit Board Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Team Board"
                size="sm"
            >
                <TeamBoardForm
                    board={teamBoardDetail}
                    onSubmit={handleUpdateBoard}
                    onCancel={() => setShowEditModal(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Team Board"
                size="sm"
            >
                <p>Are you sure you want to delete this team board?</p>
                <p>This action cannot be undone.</p>

                <ButtonGroup>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleDeleteBoard}
                        isLoading={isSubmitting}
                    >
                        Delete
                    </Button>
                </ButtonGroup>
            </Modal>

            {/* Share Board Modal */}
            <Modal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                title="Share Team Board"
                size="sm"
            >
                <ShareBoardForm
                    onSubmit={handleShareBoard}
                    onCancel={() => setShowShareModal(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Thêm Update Permission Modal */}
            <Modal
                isOpen={showUpdatePermissionModal}
                onClose={() => setShowUpdatePermissionModal(false)}
                title="Update Member Permission"
                size="sm"
            >
                {selectedMember && (
                    <UpdatePermissionForm
                        member={selectedMember}
                        onSubmit={handleUpdatePermission}
                        onCancel={() => setShowUpdatePermissionModal(false)}
                        isLoading={isSubmitting}
                    />
                )}
            </Modal>

            {/* Thêm Remove Member Confirmation Modal */}
            <Modal
                isOpen={showRemoveMemberModal}
                onClose={() => setShowRemoveMemberModal(false)}
                title="Remove Member"
                size="sm"
            >
                {selectedMember && (
                    <>
                        <p>Are you sure you want to remove {selectedMember.name} from this team board?</p>
                        <p>This action cannot be undone.</p>

                        <ButtonGroup>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowRemoveMemberModal(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleConfirmRemoveMember}
                                isLoading={isSubmitting}
                            >
                                Remove
                            </Button>
                        </ButtonGroup>
                    </>
                )}
            </Modal>
        </>
    );
};