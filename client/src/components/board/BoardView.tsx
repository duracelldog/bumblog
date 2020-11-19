import React, { useEffect, useState } from 'react';
import {Link, match, RouteChildrenProps} from 'react-router-dom';
import axios from 'axios';
import {boardListType} from './BoardHome';
import {useHistory} from 'react-router-dom';
import defaultThumbnail from '../../assets/images/board/default_thumbnail.jpg';
import {BsPencilSquare, BsTrash} from 'react-icons/bs'
import path from 'path';
import useModal from '../../redux/hooks/useModal';

type ParamsType = {
    id: string;
}

function BoardView(props: RouteChildrenProps<ParamsType>){

    const {onOpenConfirmModal, onCloseModal} = useModal();

    const [listData, setListData] = useState<boardListType>({
        id: '',
        tags: '',
        title: '',
        description: '',
        t_originalName: '',
        t_fileName: '',
        boardImages: [],
        user: {
            name: ''
        }
    });

    const [thumbnailImageState, setThumbnailImageState] = useState('');
    const history = useHistory();
    
    useEffect(()=>{

        window.scrollTo(0, 0);

        axios({
            method: 'get',
            url: `/api/board/list/${props.match?.params.id}`
        }).then((res) =>{
            if(res.data){

                setListData(res.data);
                const thumbnailImage = res.data.thumbnailImage[0];

                if(thumbnailImage){
                    setThumbnailImageState(path.resolve('./uploads', thumbnailImage.filename));
                }else{
                    setThumbnailImageState(defaultThumbnail);   
                }
                
            }
        });
    }, []);


    const handleDelete = () =>{
        onOpenConfirmModal({
            status: true,
            title: '정말 삭제하시겠습니까?',
            desc: '삭제한 데이터는 복원할 수 없습니다.',
            confirm: {
                isShow: true,
                func: () => {
                    axios({
                        method: 'delete',
                        url: '/api/board/list',
                        data: listData
                    }).then((res) =>{
                        console.log('deleteRes', res.data);
                        onCloseModal();
                        history.push('/board');
                    });
                }
            }
        });   
    }


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
                <article className="bb-board-view__article tui-editor-contents" dangerouslySetInnerHTML={{__html: listData.description}}></article>
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