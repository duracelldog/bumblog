import React, { useEffect } from 'react';
import {Link, RouteChildrenProps} from 'react-router-dom';
import {boardListType} from './BoardHome';
import defaultThumbnail from '../../assets/images/board/default_thumbnail.jpg';
import {BsPencilSquare, BsTrash} from 'react-icons/bs'
import path from 'path';
import useModal from '../../redux/hooks/useModal';
import { gql, useMutation, useQuery } from '@apollo/client';

const GET_LIST = gql`
    mutation GetBoardList($id: Int!){
        boardList(id: $id){
            id
            tags
            title
            contents
            boardImages{
                fileName
            }
            user{
                name
            }
        }
    }
`;

const DELETE_LIST = gql`
    mutation DeleteBoardList($id: Int!){
        deleteBoardList(id: $id)
    }
`;

function BoardView(props: RouteChildrenProps<{id: string}>){

    const boardId = props.match?.params.id ? parseInt(props.match?.params.id) : 0
    const {onOpenConfirmModal, onCloseModal} = useModal();

    const [getBoardList, getBoardListResult] = useMutation<{boardList: boardListType}>(GET_LIST);
    const [deleteBoardList, deleteBoardListResult] = useMutation<{deleteBoardList: boolean}>(DELETE_LIST);

    const handleDelete = () =>{
        onOpenConfirmModal({
            status: true,
            title: '정말 삭제하시겠습니까?',
            desc: '삭제한 데이터는 복원할 수 없습니다.',
            confirm: {
                isShow: true,
                func: () => {
                    deleteBoardList({variables: {
                        id: boardId
                    }});         
                }
            }
        });   
    }

    const backgroundImageStyle = {
        backgroundImage: getBoardListResult.data?.boardList.t_fileName ? (
            `url(${path.resolve('./uploads', getBoardListResult.data.boardList.t_fileName)})`
        ) : (
            `url(${defaultThumbnail})`
        )
    }

    useEffect(()=>{
        if(deleteBoardListResult.data){
            onCloseModal(); 
            props.history.push('/board');
        }
    }, [deleteBoardListResult.data])

    useEffect(()=>{
        getBoardList({
            variables: {
                id: boardId
            }
        })
        window.scrollTo(0, 0);
    }, []);

    if(getBoardListResult.error){
        return <main className="bb-board-view__main"></main>;
    }

    return (
        <main className="bb-board-view__main">
            <section className="bb-board-view__hero-section" style={backgroundImageStyle}>
                <div className="bb-board-view__hero-section-title-wrapper">
                    <h1>{getBoardListResult.data?.boardList.title}</h1>
                    <div className="bb-board-view__subtitle"></div>
                </div>
            </section>
            <section className="bb-board-view__article-section">
                {getBoardListResult.data && (
                    <article className="bb-board-view__article tui-editor-contents" dangerouslySetInnerHTML={{__html: getBoardListResult.data.boardList.contents}}></article>
                )}       
            </section>
            <section className="bb-board-view__buttons-section">
                <ul className="bb-board-view__update-btns">
                    <li>
                        <button>
                            <Link to={`/board/write/${props.match?.params.id}`}>
                                <BsPencilSquare className="bb-board-view__pencil-icon" />
                            </Link>
                        </button>
                    </li>
                    <li>
                        <button onClick={handleDelete}>
                            <BsTrash className="bb-board-view__tresh-icon" />
                        </button>
                    </li>
                </ul>
            </section>
        </main>
    );
    
}

export default BoardView;