/**
 * File Description: Board's settings page
 * Updated Date:
 * Contributors:
 * Version:
 */

import React, {useState} from 'react';
import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import {useNavigate} from "react-router-dom";
import {getUserInfo} from "../../util";
import Button from "../../general/buttons/Button";
import BaseUrlPath from "../../../enums/BaseUrlPath";
import {ChevronLeftIcon, XCircleIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import Input from "../../general/inputs/Input";
import './board.css'

/**
 * Landing page component
 */
export const BoardSettings = () => {

    const navigate = useNavigate();

    const [boardNameInput, setBoardNameInput] = useState('');
    const [boardCodeInput, setBoardCodeInput] = useState('');
    const [boardDeadlineTimeInput, setBoardDeadlineTimeInput] = useState('');
    const [boardDeadlineDateInput, setBoardDeadlineDateInput] = useState('');
    const [boardDescriptionInput, setBoardDescriptionInput] = useState('');
    const [boardStatuses, setBoardStatuses] = useState(
        ['To Do', 'testtest', 'Done', 'a very long status', 'example', 'anything']
    )
    const [boardNewStatusInput, setBoardNewStatusInput] = useState('');
    const [boardExistingTags, setBoardExistingTags] = useState([
        {'tagColour': '#fcf6c3', tagName: 'test1'},
        {'tagColour': '#ffafaf', tagName: 'test2'},
        {'tagColour': '#aff0ff', tagName: 'test3'},
    ]);
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

    const minDeadlineDate = new Date();
    const userInfo = getUserInfo();
    const removeIcon = <XCircleIcon color={"var(--dark-grey)"} className={"clickable"} strokeWidth={2}
                                    viewBox="0 0 24 24" width={22} height={22}/>
    const addIcon = <PlusCircleIcon color={"var(--dark-grey)"} className={"clickable"} strokeWidth={2}
                                    viewBox="0 0 24 24" width={30} height={30}/>
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
                        {errors.teamName && <span className="text-red small-text">{errors.teamName}</span>}
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
                                    {status} {status === 'To Do' || status === 'Done' ? null : removeIcon}
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
                                value={boardNameInput}
                                onChange={(e) => setBoardNameInput(e.target.value)}
                            />
                            <button className="icon-btn">
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
                        {boardExistingTags.map((tag) => {
                            return (
                                <div className={"tag-item"}>
                                    {tag.tagName}
                                    <div className={"tag-circle"} style={{backgroundColor: tag.tagColour}} />
                                    {removeIcon}
                                </div>
                            )
                        })}
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
                            <button className="icon-btn">
                                {addIcon}
                            </button>
                        </div>

                        {errors.boardNewTag && <span className="text-red small-text">{errors.boardNewTag}</span>}
                    </div>
                </div>

                {/* submit button */}
                <Button className="btn-brown btn-submit" type={"submit"}>
                    Save Changes
                </Button>
            </form>

            <span className={"text-red underline clickable"} style={{width:"100%", textAlign: "end"}} >Delete Board</span>

        </WhiteBackground>
    );


}

export default BoardSettings;