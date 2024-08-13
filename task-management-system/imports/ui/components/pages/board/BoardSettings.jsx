/**
 * File Description: Board's settings page
 * Updated Date:
 * Contributors:
 * Version:
 */

import React, {Fragment, useState} from 'react';
import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import {useNavigate, useParams} from "react-router-dom";
import { useSubscribe, useTracker } from 'meteor/react-meteor-data'
import {getUserInfo} from "../../util";
import Button from "../../general/buttons/Button";
import BaseUrlPath from "../../../enums/BaseUrlPath";
import {ChevronLeftIcon, XCircleIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import Input from "../../general/inputs/Input";
import './board.css'
import BoardCollection from '../../../../api/collections/board';
import TagCollection from '../../../../api/collections/tag';
import StatusCollection from '../../../../api/collections/status';

/**
 * Landing page component
 */
export const BoardSettings = () => {

    const navigate = useNavigate();
    const {boardId} = useParams();

    const [boardNameInput, setBoardNameInput] = useState('');
    const [boardCodeInput, setBoardCodeInput] = useState('');
    const [boardDeadlineTimeInput, setBoardDeadlineTimeInput] = useState('');
    const [boardDeadlineDateInput, setBoardDeadlineDateInput] = useState('');
    const [boardDescriptionInput, setBoardDescriptionInput] = useState('');
    const [boardStatuses, setBoardStatuses] = useState([]);
    // ['To Do', 'testtest', 'Done', 'a very long status', 'example', 'anything']

    const [boardNewStatusInput, setBoardNewStatusInput] = useState('');
    const [boardExistingTags, setBoardExistingTags] = useState([]);
        // {'tagColour': '#fcf6c3', tagName: 'test1'},
        // {'tagColour': '#ffafaf', tagName: 'test2'},
        // {'tagColour': '#aff0ff', tagName: 'test3'},
    const [boardNewTagName, setBoardNewTagName] = useState('')
    const [boardNewTagHex, setBoardNewTagHex] = useState('')


    const [errors, setErrors] = useState({
        boardName: "",
        boardCode: "",
        boardDeadline: "",
        boardDescription: "",
        boardNewStatus: "",
        boardNewTag: ""
    });

    const startCond = (boardNameInput === '' && boardCodeInput === '' && boardDeadlineTimeInput === '' && boardDeadlineDateInput === '' && boardDescriptionInput === '');
    console.log(startCond);
    const minDeadlineDate = new Date();
    const userInfo = getUserInfo();
    const removeIcon = <XCircleIcon color={"var(--dark-grey)"} className={"clickable"} strokeWidth={2}
                                    viewBox="0 0 24 24" width={22} height={22}/>
    const addIcon = <PlusCircleIcon color={"var(--dark-grey)"} className={"clickable"} strokeWidth={2}
                                    viewBox="0 0 24 24" width={30} height={30}/>

    //get board
    const isLoadingBoards = useSubscribe('board_by_id', boardId);
    const isLoadingTags = useSubscribe('tag_by_board', boardId);
    const isLoadingStatus = useSubscribe('status_by_board', boardId);

    const boardData = useTracker(()=>{
        const board = BoardCollection.findOne({_id : boardId});

        if(board && startCond){
            setBoardNameInput(board.boardName);
            setBoardCodeInput(board.boardCode);
            const deadline = new Date(board.boardDeadline)
            setBoardDeadlineDateInput(deadline.toISOString().split('T')[0]);
            setBoardDeadlineTimeInput(deadline.toISOString().split('T')[1].substring(0, 5));
            setBoardDescriptionInput(board.boardDescription);
        }
    });

    const tagData = useTracker(()=>{
        const tags = TagCollection.findOne({boardId : boardId});
        if(tags && boardExistingTags.length === 0){
            setBoardExistingTags(tags.tags); //get array of {name, colour}
        }
    });

    const statusData = useTracker(()=>{
        const status = StatusCollection.findOne({boardId : boardId});
        if(status && boardStatuses.length === 2){
            setBoardStatuses(status.names); //array of status
        }
    });


    const handleAddStatus = (event) => {
        event.preventDefault();
        const newError = {}

        if (boardStatuses.includes(boardNewStatusInput)) {
            newError.boardNewStatus = "Status has already been added";
        } else if(!boardNewStatusInput){
            console.log("!!!!!");
            newError.boardNewStatus = "Please input a valid status";
        }
        else {
            setBoardStatuses([...boardStatuses, boardNewStatusInput]);
            setBoardNewStatusInput('');
        }
        setErrors(newError);
    }

    const handleRemoveStatus = (event, removedStatus) => {
        event.preventDefault();
        setBoardStatuses(boardStatuses.filter(status => status !== removedStatus));
    }


    const handleAddTag = (event) => {
        event.preventDefault();
        const isExist = boardExistingTags.some(tag => tag.tagName === boardNewTagName && tag.tagColour === boardNewTagHex);
        console.log(isExist);
        const newError = {}
        if (isExist) {
            newError.boardNewTag = "Tag has already been added";
        } else if(!boardNewTagName){
            newError.boardNewTag = "Please input a valid tag name";
        } else {
            setBoardExistingTags([...boardExistingTags, {tagName: boardNewTagName, tagColour: boardNewTagHex}]);
            setBoardNewTagName('');
            setBoardNewTagHex('');
        }
        setErrors(newError)
    }

    //set as tag object
    const handleRemoveTag = (event, removedTag, tagName, tagColour) => {
        event.preventDefault();
        setBoardExistingTags(boardExistingTags.filter(tag => tag !== removedTag));
    }



    const saveChanges = (event) => {
        event.preventDefault();
        const newErrors = {};
        let isError = false;

        if(!boardNameInput){
            newErrors.boardName = "Please fill in your board name";
            isError = true;
        } else if (boardNameInput.length > 20) {
            newErrors.boardName = "Board name can not exceed 20 characters";
            isError = true
        }

        if(!boardCodeInput){
            newErrors.boardCode = "Please fill in your board code";
            isError = true;
        } else if (boardNameInput.length > 10) {
            newErrors.boardCode = "Board code can not exceed 10 characters";
            isError = true
        }


        if(!boardDeadlineDateInput){
            newErrors.boardDeadline = "Please fill in your deadline date";
            isError = true;
        }

        if(!boardDeadlineTimeInput){
            newErrors.boardDeadline = "Please fill in your deadline time";
            isError = true;
        }

        if(!boardDescriptionInput){
            newErrors.boardDescription = "Please fill in your board description";
            isError = true;
        } else if (boardDescriptionInput.length > 150) {
            newErrors.boardDescription = "Board description can not exceed 150 characters";
            isError = true
        } 

        setErrors(newErrors);

        //save in board
        if(!isError){
            Meteor.call('update_board', boardId, 
                {
                    boardName: boardNameInput,
                    boardCode: boardCodeInput,
                    boardDeadline: `${boardDeadlineDateInput}T${boardDeadlineTimeInput}`,
                    boardDescription: boardDescriptionInput
                }, (error) => {
                    if (error) {
                        setErrors(error.reason);
                    } else {
                        setBoardNameInput('');
                        setBoardCodeInput('');
                        setBoardDeadlineTimeInput('');
                        setBoardDeadlineDateInput('');
                        setBoardDescriptionInput('');
                        setBoardStatuses(['To Do', 'Done']);
                        setBoardExistingTags([]);
                        setErrors('')
                    }
                });
            // Meteor.call('update_status', statusId, {
            //     statusName: boardStatuses,
            //     // boardId: boardId
            // });
            // Meteor.call('update_tag', tagId, {
            //     tagName: boardExistingTags
            // })
        }
        //save status
        //save tag
    }

    const deleteBoard = () => {

    }

    return (
        <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>

            <div className="header-space-between">
                <Button className={"flex flex-row gap-2 btn-back"}
                        onClick={() => {
                            navigate('/' + BaseUrlPath.TEAMS)
                        }}>
                    <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20}/>
                    Back
                </Button>
                <h1 className={"text-center"}>Board Settings</h1>
                <div style={{width: "120px"}}/>
            </div>


            <form className={"settings-form"}>
                {/* Input field for board name */}
                <div className='settings-form-input'>
                    <label className={"main-text text-grey"}>Board Name:</label>
                    <div className={"input-error-div"}>
                        <Input
                            type="text"
                            placeholder={"Max 20 characters"}
                            id={"boardName"}
                            value={boardNameInput}
                            onChange={(e) => setBoardNameInput(e.target.value)}
                        />
                        {errors.boardName && <span className="text-red small-text">{errors.boardName}</span>}
                    </div>
                </div>

                {/* Input field for board code */}
                <div className='settings-form-input'>
                    <label className={"main-text text-grey"}>Board Code:</label>
                    <div className={"input-error-div"}>
                        <Input
                            className={"short-input"}
                            type="text"
                            id={"boardCode"}
                            placeholder={"Max 10 characters"}
                            value={boardCodeInput}
                            onChange={(e) => setBoardCodeInput(e.target.value)}
                        />
                        {errors.boardCode && <span className="text-red small-text">{errors.boardCode}</span>}
                    </div>
                </div>

                {/* Input field for board deadline */}
                <div className='settings-form-input'>
                    <label className={"main-text text-grey"}>Deadline:</label>
                    <div className={"input-error-div"}>
                        <div className={"inner-input-group"}>
                            <Input
                                className={"short-input"}
                                type="date"
                                min={minDeadlineDate.toISOString().split('T')[0]}
                                id={"boardDeadline"}
                                value={boardDeadlineDateInput}
                                onChange={(e) => setBoardDeadlineDateInput(e.target.value)}
                            />
                            <Input
                                className={"short-input"}
                                type="time"
                                id={"boardDeadline"}
                                value={boardDeadlineTimeInput}
                                onChange={(e) => setBoardDeadlineTimeInput(e.target.value)}
                            />
                        </div>
                        {errors.boardDeadline && <span className="text-red small-text">{errors.boardDeadline}</span>}
                    </div>
                </div>

                {/* Input field for board description */}
                <div className='settings-form-input' style={{alignItems: "start"}}>
                    <label className={"main-text text-grey"} style={{marginTop: "6px"}}>Description:</label>
                    <div className={"input-error-div"}>
                        <textarea
                            style={{minHeight: "100px", maxHeight: "250px"}}
                            className={"input-base main-text"}
                            placeholder={"Max 150 characters"}
                            id={"boardDescription"}
                            value={boardDescriptionInput}
                            onChange={(e) => setBoardDescriptionInput(e.target.value)}
                        />
                        {errors.boardDescription &&
                            <span className="text-red small-text">{errors.boardDescription}</span>}
                    </div>
                </div>

                {/* Board status display */}
                <div className='settings-form-input' style={{alignItems: "start"}}>
                    <label className={"main-text text-grey"}>Statuses:</label>
                    <div className={"status-group"}>
                        {boardStatuses.map((status) => {
                            return (
                                <div className={"status-item"}>
                                    {status} {status === 'To Do' || status === 'Done' || status === ''? null : <button className="icon-btn" onClick={(e)=>handleRemoveStatus(e, status)}>{removeIcon}</button>}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* area for new status adding */}
                <div className='settings-form-input'>
                    {/* empty div for no label here */}
                    <div/>
                    <div className={"input-error-div"}>
                        <div className={"input-row"}>
                            <Input
                                className={"short-input"}
                                type="text"
                                placeholder={"Add Custom Status"}
                                id={"status"}
                                value={boardNewStatusInput}
                                onChange={(e) => setBoardStatuses(e.target.value)}
                            />
                            <button className="icon-btn" onClick={(e) => handleAddStatus(e)}>
                                {addIcon}
                            </button>
                        </div>

                        {errors.boardNewStatus && <span className="text-red small-text">{errors.boardNewStatus}</span>}
                    </div>
                </div>

                {/* Board tags display */}
                <div className='settings-form-input' style={{alignItems: "start"}}>
                    <label className={"main-text text-grey"}>Tags:</label>
                    <div className={"tag-group"}>
                        {boardExistingTags === ''? null : (boardExistingTags.map((tag) => {
                            return (
                                <div className={"tag-item"}>
                                    {tag.tagName}
                                    <div className={"tag-circle"} style={{backgroundColor: tag.tagColour}} />
                                    <button className="icon-btn" onClick={(e)=>handleRemoveTag(e, tag.tagName, tag.tagColour)}>{removeIcon}</button>
                                </div>
                            )
                        }))}
                        
                    </div>
                </div>

                {/* area for new tag adding */}
                <div className='settings-form-input'>
                    {/* empty div for no label here */}
                    <div/>
                    <div className={"input-error-div"}>
                        <div className={"input-row"}>
                            <Input
                                className={"short-input"}
                                type="text"
                                placeholder={"Custom Tag"}
                                id={"tagName"}
                                value={boardNewTagName}
                                onChange={(e) => setBoardNewTagName(e.target.value)}
                            />
                            <Input
                                className={"input-colour-small"}
                                type="color"
                                id={"tagHex"}
                                value={boardNewTagHex}
                                onChange={(e) => setBoardNewTagHex(e.target.value)}
                            />
                            <button className="icon-btn" onClick={handleAddTag}>{addIcon}</button>
                        </div>

                        {errors.boardNewTag && <span className="text-red small-text">{errors.boardNewTag}</span>}
                    </div>
                </div>

                {/* submit button */}
                <Button className="btn-brown btn-submit" type={"submit"} onClick={(e)=>saveChanges(e)}>
                    Save Changes
                </Button>
            </form>

            <span className={"text-red underline clickable"} style={{width:"100%", textAlign: "end"}} >Delete Board</span>

        </WhiteBackground>
    );


}

export default BoardSettings;