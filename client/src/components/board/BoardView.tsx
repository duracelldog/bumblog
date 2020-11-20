import React, { useEffect, useState } from 'react';
import {Link, match, RouteChildrenProps} from 'react-router-dom';
import {boardListType} from './BoardHome';
import {useHistory} from 'react-router-dom';
import defaultThumbnail from '../../assets/images/board/default_thumbnail.jpg';
import {BsPencilSquare, BsTrash} from 'react-icons/bs'
import path from 'path';
import useModal from '../../redux/hooks/useModal';
import { gql, useMutation, useQuery } from '@apollo/client';

const GET_LIST = gql`
    query GetBoardList($id: Int!){
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

    const boardId = props.match?.params.id ? parseInt(props.match?.params.id) : 1;
    const {onOpenConfirmModal, onOpenAlertModal, onCloseModal} = useModal();
    const GBLResult = useQuery(GET_LIST, {
        variables: {
            id: boardId
        }
    });
    const [deleteBoardList, DBLResult] = useMutation(DELETE_LIST);
    
    const [listData, setListData] = useState<boardListType>();
    const history = useHistory();
    const [thumbnailImageState, setThumbnailImageState] = useState('');

    useEffect(() => {

        if(!GBLResult.loading){
            if(GBLResult.data){
                setListData(GBLResult.data.boardList);
                if(GBLResult.data.t_fileName){
                    setThumbnailImageState(path.resolve('./uploads', GBLResult.data.t_fileName));
                }else{
                    setThumbnailImageState(defaultThumbnail);   
                }
            }
        }

        
    }, [GBLResult.loading]);

    useEffect(() => {
        console.log('DBLResult.data', DBLResult.data);

        if(!DBLResult.loading){
            if(DBLResult.data){
                onCloseModal();
                history.push('/board');
            }
        }        
    }, [DBLResult.loading])
    
    useEffect(()=>{
        window.scrollTo(0, 0);
        return () => { console.log('cleanup') };
    }, []);


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

    if(!listData){
        return (
            <main className="bb-board-view__main"></main>
        )
    }else{
        return (
            <main className="bb-board-view__main">
                <section className="bb-board-view__hero-section" style={{backgroundImage: `url(${thumbnailImageState})`}}>
                    <div className="bb-board-view__hero-section-title-wrapper">
                        <h1>{listData?.title}</h1>
                        <div className="bb-board-view__subtitle">
                            {/* {listData?.subTitle} */}
                        </div>
                    </div>
                </section>
                <section className="bb-board-view__article-section">
                    <article className="bb-board-view__article tui-editor-contents" dangerouslySetInnerHTML={{__html: listData.contents}}></article>
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

    


    
}

export default BoardView;