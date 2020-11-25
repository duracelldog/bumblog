import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import path from 'path';
import { Redirect, RouteChildrenProps } from 'react-router-dom';
import useModal from '../../redux/hooks/useModal';
import useAuth from '../../redux/hooks/useAuth';
import TextEditor from '../share/TextEditor';
import { boardImagesType, boardListType } from './BoardHome';
import { BsX } from 'react-icons/bs';
import { gql, useMutation } from '@apollo/client';

const GET_LIST = gql`
    mutation GetBoardList($id: Int!){
        boardList(id: $id){
            id
            title
            tags
            contents
            userId
            t_fileName
            t_originalName
            boardImages{
                id
                fileName
                originalName
            }
        }
    }
`;

const CREATE_LIST = gql`
    mutation CreateBoardList($boardData: CreateBoardInput!){
        createBoardList(boardData: $boardData){
            id
        }
    }
`;

const UPDATE_LIST = gql`
    mutation UpdateList($boardData: UpdateBoardInput!){
        updateBoardList(boardData: $boardData)
    }
`;



type ParamsType = {
    id: string;
}

function BoardWrite(props: RouteChildrenProps<ParamsType>){

    const boardId = props.match?.params.id ? parseInt(props.match?.params.id) : 0;

    const [getBoardList, getBoardListResult] = useMutation<{boardList: boardListType}>(GET_LIST);
    const [createBoardList] = useMutation<{
        createBoardList: boardListType,
        CreateBoardInput: boardListType
    }>(CREATE_LIST);
    const [updateBoardList, updateBoardListResult] = useMutation<{updateBoardList: Boolean}>(UPDATE_LIST);

    const {authState} = useAuth();
    const {onOpenConfirmModal, onCloseModal} = useModal();

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const thumbImageRef = useRef<HTMLInputElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);

    const [titleState, setTitleState] = useState('')
    const [tagsState, setTagsState] = useState<string[]>([]);
    
    // Thumbnail Image
    const [tempThumbnailImagePathState, setTempThumbnailImagePathState] = useState('');

    const [thumbnailImageState, setThumbnailImageState] = useState<boardImagesType|null>(null); // 수정 이미지 확인용
    const [thumbnailImageFilesState, setThumbnailImageFilesState] = useState<File|null>(null); // 신규 이미지 확인용
    
    // TextEditor
    const [textEditorContentsState, setTextEditorContentsState] = useState('');
    const [textEditorImageState, setTextEditorImageState] = useState<boardImagesType[]>([]); // 수정 이미지 확인용
    const [textEditorImageFilesState, setTextEditorImageFilesState] = useState<File[]>([]); // 신규 이미지 확인용

    const nullCheckData = (targets: {type: string; target: string;}[]): boolean =>{
        let passFlag = true;
      
        targets.forEach(item => {

            if(item.target === '' || item.target.indexOf('내용을 입력해주세요.') !== -1){
                onOpenConfirmModal({
                    status: true,
                    title: `${item.type} 오류`,
                    desc: `${item.type}을 입력해 주세요.`,
                    confirm: {
                        isShow: true,
                        func: () => {
                            onCloseModal();
                            switch(item.type){
                                case '제목':
                                    titleInputRef.current?.focus();
                                    break;
                                case '본문':
                                    if(iframeRef.current?.contentDocument)
                                        iframeRef.current?.contentDocument.body.focus();
                                    break;
                                default:
                            }
                        }
                    }
                });
                passFlag = false;
                return true;
            }
        });

        return passFlag;
       
    }

    const uploadFiles = async (boardId: string) => {
        const form = new FormData();
                
        if(thumbnailImageFilesState){
            form.append('t_file', thumbnailImageFilesState);
        }

        if(textEditorImageFilesState.length > 0){
            textEditorImageFilesState.forEach(file => {
                form.append('c_files', file);
            })
        }

        if(thumbnailImageFilesState || textEditorImageFilesState.length > 0){
            form.append('boardId', boardId);

            await axios({
                headers: {'Content-Type': 'multipart/form-data'},
                method: 'post',
                url: '/board/upload',
                data: form
            });
        }
        props.history.push('/board');
    }

    const deleteFiles = async (boardId: string) =>{
        await axios({
            method: 'delete',
            url: '/board/upload',
            data: {
                id: boardId,
                t_file: JSON.stringify(thumbnailImageState),
                c_files: JSON.stringify(textEditorImageState)
            }
        });
    }


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        const passFlag = nullCheckData([
                {type: '제목', target: titleState}, 
                {type: '태그', target: tagsState.toString()}, 
                {type: '본문', target: textEditorContentsState}
            ]);

        
        if(passFlag){
        
            if(!boardId){ // 신규 등록

                const boardData = {
                    title: titleState,
                    tags: tagsState.toString(),
                    contents: textEditorContentsState,
                    userId: authState.id

                }

                const boardList = await createBoardList({
                    variables: {
                        boardData
                    }
                });

                if(boardList.data){
                    await uploadFiles(boardList.data.createBoardList.id);
                }

    
            }else{ // 수정 등록

                const boardData = {
                    id: boardId,
                    title: titleState,
                    tags: tagsState.toString(),
                    contents: textEditorContentsState,
                }

                await updateBoardList({
                    variables: {
                        boardData
                    }
                });

                await deleteFiles(boardId.toString());
                await uploadFiles(boardId.toString());
            }
    
    
            // 데이터 비우기
            setTitleState('');
          
            setThumbnailImageState(null);
            setThumbnailImageFilesState(null);

            setTextEditorImageState([]);
            setTextEditorImageFilesState([]);

            setTextEditorContentsState('');
        }
    }

    const setTitleForOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const { value } = e.target;
        setTitleState(value);
    }

    const setTagsData = (e:React.MouseEvent<HTMLSpanElement, MouseEvent>) =>{

        const classList = e.currentTarget.classList;
        const innerText = e.currentTarget.innerText;

        if(classList.contains('on')){
            // 버튼 OFF
            classList.remove('on');
            if(tagsState.indexOf(innerText) !== -1){ // 해당 태그가 있을 경우 => 뺸다
                setTagsState(tagsState.filter(tag => tag !== innerText));
            }
        }else{
            // 버튼 ON
            classList.add('on');
            if(tagsState.indexOf(innerText) === -1){ // 해당 태그가 없을 경우 => 더한다
                setTagsState(tagsState.concat(innerText));
            }
        }
    }

    const setTagsOnViewByData = (initTags:string[]) =>{
        document.querySelectorAll('.bb-board-write__tags-wrapper > span').forEach(span =>{
            initTags.forEach(tag =>{
                if(tag === span.innerHTML){
                    span.classList.add('on');
                }
            })
        })
    }

    const setThumbnailImageFile = (e: React.ChangeEvent<HTMLInputElement>) =>{
        if(e.currentTarget.files){

            const imageFile = e.currentTarget.files[0];

            if(imageFile){
                if(verifyImageType(imageFile.type) === false){
                    onOpenConfirmModal({
                        status: true,
                        title: '이미지 오류',
                        desc: 'jpeg, png, jpg 파일만 가능합니다.',
                        confirm: {
                            isShow: false
                        }
                    });
                    e.currentTarget.value = ""; // Input File 초기화
                    setThumbnailImageFilesState(null); // State 초기화
                }else{
                    setTempThumbnailImageOnView(imageFile);
                    setThumbnailImageFilesState(imageFile);
                }
            }
        }
    }


    const setTempThumbnailImageOnView = (thumbImageFile: File) =>{
        const reader = new FileReader();
        reader.onload = function(e){
            if(e.target?.result){
                setTempThumbnailImagePathState(e.target.result.toString());
            }
        }
        reader.readAsDataURL(thumbImageFile);
    }

    const verifyImageType = (image: string) =>{
        const types = ['image/jpeg', 'image/png', 'image/jpg'];
        if(types.indexOf(image) === -1){
            return false;
        }else{
            return true;
        }
    }

    const removeThumbnailImage = () =>{
        setTempThumbnailImagePathState('');
        setThumbnailImageState(null);
        setThumbnailImageFilesState(null);   
    }

    // 업데이트 완료 후
    useEffect(()=>{
        if(updateBoardListResult.data){
            props.history.push('/board/view?_id=' + boardId);
        }
    }, [updateBoardListResult.data])
    

    // 수정모드로 진입 후
    useEffect(()=>{
        if(getBoardListResult.data){
            const {title, tags, t_fileName, t_originalName, id, boardImages, contents} = getBoardListResult.data.boardList;
            setTitleState(title);
            setTagsState(tags.split(','));
            setTextEditorContentsState(contents);
            if(t_fileName){
                setThumbnailImageState({
                    id: parseInt(id),
                    fileName: t_fileName,
                    originalName: t_originalName
                });
                setTempThumbnailImagePathState(path.resolve('./public/images/board', t_fileName));
            }
            setTextEditorImageState(boardImages);   
    
            // 화면에 표시
            setTagsOnViewByData(tags.split(','));
        }
    }, [getBoardListResult.data]);

    useEffect(()=>{
        if(boardId){
            getBoardList({
                variables:{
                    id: boardId
                }
            })
        }
        window.scrollTo(0, 0);
    }, []);


    if(!authState.id){
        return <Redirect to={`/login?redirect=/board/write`} />;
    }

    return (
        <main className="bb-board-write__main">
            <section className="bb-board-write__form-section">
                <form className="bb-board-write__form" onSubmit={onSubmit}>
                <input className="bb-board-write__title" ref={titleInputRef} placeholder="제목을 입력해주세요." type="text" name="title" value={titleState} onChange={setTitleForOnChange}/>
                <div className="bb-board-write__writer">작성자 : {authState.name}</div>
                {/* <input className="bb-board-write__title--sub" placeholder="소제목을 입력해주세요." type="text" name="subTitle" value={boardTitle?.subTitle} onChange={setTitleForOnChange}/> */}
                <div className="bb-board-write__tags-wrapper">
                    <span onClick={setTagsData}>개발</span>
                    <span onClick={setTagsData}>공부</span>
                    <span onClick={setTagsData}>생각</span>
                </div>
                <TextEditor 
                    textEditorContentsState={textEditorContentsState}
                    setTextEditorContentsState={setTextEditorContentsState}
                    textEditorImageState={textEditorImageState}
                    setTextEditorImageState={setTextEditorImageState}
                    textEditorImageFilesState={textEditorImageFilesState}
                    setTextEditorImageFilesState={setTextEditorImageFilesState}
                />
                <div className={`bb-board-write__image-tiles ${tempThumbnailImagePathState !== '' && 'on'}`}>
                    <span style={{backgroundImage: `url(${tempThumbnailImagePathState})`}} onClick={removeThumbnailImage}><BsX /></span>
                </div>
                <div className="bb-board-write__image-upload-btn">
                    <input type="file" ref={thumbImageRef} onChange={setThumbnailImageFile} />
                    <button type="button" onClick={()=> thumbImageRef.current?.click()}>썸네일 이미지 업로드</button>
                </div>
                <div className="bb-board-write__buttons">
                    <button type="button" onClick={() => props.history.push('/board')}>취소</button>
                    <button type="submit">완료</button>
                </div>
                </form>
            </section>
        </main>
    )
}

export default BoardWrite;