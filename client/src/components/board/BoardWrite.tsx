import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import path from 'path';
import {Redirect, RouteChildrenProps, useHistory} from 'react-router-dom';
import useModal from '../../redux/hooks/useModal';
import useAuth from '../../redux/hooks/useAuth';
import TextEditor from '../share/TextEditor';
import { boardImagesType, boardListType } from './BoardHome';
import { BsX } from 'react-icons/bs';

type ParamsType = {
    id: string;
}

function BoardWrite(props: RouteChildrenProps<ParamsType>){

    const history = useHistory();
    const {authState} = useAuth();
    const {onOpenConfirmModal, onCloseModal} = useModal();

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const thumbImageRef = useRef<HTMLInputElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);

    const [titleState, setTitleState] = useState('')
    const [tagsState, setTagsState] = useState<string[]>([]);
    const [idState, setIdState] = useState('');

    const [isLoginState, setIsLoginState] = useState<string | null>(null);

    // Thumbnail Image
    const [tempThumbnailImagePathState, setTempThumbnailImagePathState] = useState('');
    const [thumbnailImageState, setThumbnailImageState] = useState<string[]>([]);
    const [thumbnailImageFilesState, setThumbnailImageFilesState] = useState<File[]>([]);
    

    // TextEditor
    const [textEditorContentsState, setTextEditorContentsState] = useState('');
    const [textEditorImageState, setTextEditorImageState] = useState<boardImagesType[]>([]);
    const [textEditorImageFilesState, setTextEditorImageFilesState] = useState<File[]>([]); // 신규 이미지 확인용



    const setContentsOnPage = (id:string) =>{
        axios({
            method: 'get',
            url: `/api/board/list/${props.match?.params.id}`
        }).then((res: {data: boardListType}) =>{
            console.log('res', res.data);

            setTitleState(res.data.title);
            setTagsState(res.data.tags === '' ? [] : res.data.tags.split(','));

            setThumbnailImageState(res.data.t_fileName.split(','));
            setTextEditorImageState(res.data.boardImages);
            setTagsOnViewByData(res.data.tags.split(','));

            if(res.data.t_fileName){
                setTempThumbnailImagePathState(path.resolve('./uploads', res.data.t_fileName.split(',')[0]));
            }

            setTextEditorContentsState(res.data.contents);
        });
    }


    useEffect(()=>{

        const listId = props.match?.params.id;

        console.log("match", listId);
        
        // 수정요청으로 들어올 경우
        if(listId){
            setIdState(listId);
            setContentsOnPage(listId);
        }

        window.scrollTo(0, 0);

    }, []);


    const nullCheckData = (targets: {type: string; target: string;}[]): boolean =>{
        let passFlag = true;
      
        targets.some(item => {
            console.log('item', item);

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

    const setFormData = (idState: string) =>{
        const form = new FormData();

        form.append('title', titleState);
        form.append('tags', JSON.stringify(tagsState));
        form.append('description', textEditorContentsState);
        form.append('writer', authState.name);

        if(idState == ''){ // 신규 등록

            // 썸네일 이미지
            if(thumbnailImageFilesState){ 
                thumbnailImageFilesState.forEach(file =>{
                    if(file){
                        form.append('thumbnailImageFile', file);
                    }
                });
            }

            // 본문 이미지     
            if(textEditorImageFilesState){ 
                textEditorImageFilesState.forEach(file =>{
                    if(file){
                        form.append('descriptionImageFile', file);
                    }
                })
            }           

        }else{ // 수정 등록
            form.append('_id', idState);

            form.append('thumbnailImage', JSON.stringify(thumbnailImageState)); // 기존 이미지 정보
            form.append('descriptionImage', JSON.stringify(textEditorImageState)); // 기존 이미지 정보
            
            // 썸네일 이미지
            if(thumbnailImageFilesState){ // 이미지를 추가, 변경할때
                thumbnailImageFilesState.forEach(file =>{
                    if(file){
                        form.append('thumbnailImageFile', file);
                    }
                })
            }

            // 본문 이미지
            if(textEditorImageFilesState){ // 이미지를 추가, 변경할때
                textEditorImageFilesState.forEach(file =>{
                    if(file){
                        form.append('descriptionImageFile', file);
                    }
                })
            }
        }

        return form;
    }


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        const passFlag = nullCheckData([
                {type: '제목', target: titleState}, 
                {type: '태그', target: tagsState.toString()}, 
                {type: '본문', target: textEditorContentsState}
            ]);

        
        if(passFlag){
            const form = setFormData(idState);
        
            if(idState === ''){ // 신규 등록
                
                axios({
                    headers: {'Content-Type': 'multipart/form-data'},
                    method: 'post',
                    url: '/api/board/list',
                    data: form
                }).then((res) =>{
                    console.log('post_res', res.data[0]);
                    history.push('/board');
                });
    
            }else{ // 수정 등록
      
                axios({
                    headers: {'Content-Type': 'multipart/form-data'},
                    method: 'put',
                    url: '/api/board/list',
                    data: form
                }).then((res) =>{
                    console.log('put_res', res.data[0]);
                    history.push('/board/view?_id=' + idState);
                });
            }
    
    
            // 데이터 비우기
            setTitleState('');
          
            setThumbnailImageState([]);
            setThumbnailImageFilesState([]);

            setTextEditorImageState([]);
            setTextEditorImageFilesState([]);

            setTextEditorContentsState('');
        }
    }

    const setTitleForOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = e.target;
        setTitleState(value);
    }

    const setTagsData = (e:React.MouseEvent<HTMLSpanElement, MouseEvent>) =>{

        console.log('클릭');

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
                    setThumbnailImageFilesState([]); // State 초기화
                }else{
                    setTempThumbnailImageOnView(imageFile);
                    setThumbnailImageFilesState(thumbnailImageFilesState.concat(imageFile));
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
        setThumbnailImageState([]);
        setThumbnailImageFilesState([]);   
    }

    useEffect(()=>{
        console.log('authSat', authState);

        setIsLoginState(authState.email);
    }, [authState])

    return (
        <main className="bb-board-write__main">
            {isLoginState === "" ? (
                <Redirect to={`/login?redirect=/board/write`} />
            ) : (
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
                        <button type="button" onClick={() => history.push('/board')}>취소</button>
                        <button type="submit">완료</button>
                    </div>
                    </form>
                </section>
            )}
        </main>
    )
}

export default BoardWrite;