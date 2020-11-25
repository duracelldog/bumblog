import React, { useEffect, useState } from 'react';
import {boardListType} from './BoardHome';
import {Link} from 'react-router-dom';
import path from 'path';
import defaultThumbnail from '../../assets/images/board/default_thumbnail.jpg';

function BoardList({data}: {data: boardListType}){

    // console.log('data', data);

    const [tags, setTags] = useState<string>('');
    const [date, setDate] = useState('');
    const [thumbImg, setThumbImg] = useState(defaultThumbnail);

    const createDateText = (createdAt: Date) =>{
        const date = new Date(createdAt);

        const year = date.getUTCFullYear(); // 2020
        const month = checkDate(date.getUTCMonth()+1);
        const day = checkDate(date.getUTCDate());
        const hour = checkDate(date.getUTCHours());
        const minutes = checkDate(date.getUTCMinutes());
        const seconds = checkDate(date.getUTCSeconds());


        // return `${year}.${month}.${day} ${hour}:${minutes}:${seconds}`;
        return `${year}.${month}.${day}`;
    }

    const checkDate = (date:number) =>{
        if(date.toString().length === 1){
            return "0" + date.toString();
        }else{
            return date.toString();
        }
    };

    useEffect(()=>{
        setTags(data.tags);

        if(data.t_fileName){
            setThumbImg(path.resolve('./public/images/board', data.t_fileName.split(',')[0]));
        }
        
        setDate(createDateText(data.createdAt));
    }, []);

    return (
            <li className="bb-board-list__body">
                <Link to={`/board/view/${data.id}`}>
                    <div className="bb-board-list__contents-wrapper">
                        <div className="bb-board-list__article-wrapper">
                            <div>
                                <div className="bb-board-list__article-title">{data.title}</div>
                                <div className="bb-board-list__article-tags">
                                    {data.tags.split(',').map((tag, index) => <span key={index}>{tag}</span>)}
                                </div>
                            </div>
                            
                            {/* <div className="bb-board-list__article-description" dangerouslySetInnerHTML={{__html: data.description}}></div> */}
                            <ul className="bb-board-list__article-extra-info">
                                <li>{date}</li>
                                <li>{data.user.name}</li>
                            </ul>
                        </div>
                        <div>
                            <figure className="bb-board-list__image" style={{backgroundImage: `url(${thumbImg})`}}/>
                        </div>
                    </div>
                </Link>
            </li>
        
    )
}

export default BoardList;