/**
 * File Description: Board's settings page
 * Updated Date: 15/08/2024
 * Contributors: Audrey, Nikki
 * Version: 1.5
 */

import React, { Fragment, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { useNavigate, useParams } from "react-router-dom";
import { useSubscribe, useTracker } from 'meteor/react-meteor-data'
import { XCircleIcon } from "@heroicons/react/24/outline";
import Spinner from "react-bootstrap/Spinner";

import BoardCollection from '../../../../api/collections/board';
import TeamCollection from "../../../../api/collections/team";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import Button from "../../general/buttons/Button";
import Input from "../../general/inputs/Input";
import classNames from "classnames";
import BaseUrlPath from "../../../enums/BaseUrlPath";
import { getUserInfo } from "../../util";
import './board.css'
import { backLeftArrow, closeModalIcon, saveIcon, subAddIcon } from "../../icons";

/**
 * Board Settings Page
 */
export const BoardSettings = () => {

    const userInfo = getUserInfo();
    const navigate = useNavigate();

    // url parameters
    const {boardId} = useParams();
    const {teamId} = useParams();

    // variables
    const [isSubmitting, setIsSubmitting] = useState(false); // State to handle submission status
    const [boardNameInput, setBoardNameInput] = useState('');
    const [boardCodeInput, setBoardCodeInput] = useState('');
    const [boardDeadlineTimeInput, setBoardDeadlineTimeInput] = useState('');
    const [boardDeadlineDateInput, setBoardDeadlineDateInput] = useState('');
    const [boardDescriptionInput, setBoardDescriptionInput] = useState('');
    const [boardStatuses, setBoardStatuses] = useState([]);

    const [boardNewStatusInput, setBoardNewStatusInput] = useState('');
    const [boardExistingTags, setBoardExistingTags] = useState([]);
    const [boardNewTagName, setBoardNewTagName] = useState('')
    const [boardNewTagHex, setBoardNewTagHex] = useState('#000000')

    const [errors, setErrors] = useState({
        boardName: "",
        boardCode: "",
        boardDeadline: "",
        boardDescription: "",
        boardNewStatus: "",
        boardNewTag: ""
    });
    const [updateSuccess, setUpdateSuccess] = useState(null)
    const [deleteMessage, setDeleteMessage] = useState('')

    const startCond = (boardNameInput === '' && boardCodeInput === '' && boardDeadlineTimeInput === '' && boardDeadlineDateInput === '' && boardDescriptionInput === '');

    const removeIcon = <XCircleIcon color={"var(--dark-grey)"} className={"clickable"} strokeWidth={2} viewBox="0 0 24 24" width={22} height={22}/>

    const isLoadingTeam = useSubscribe('specific_team', teamId);
    const isLoadingBoard = useSubscribe('board_by_id', boardId);
    const isLoading = isLoadingTeam() || isLoadingBoard();

    const teamData = useTracker(() => {
        return TeamCollection.findOne({_id: teamId});
    });

    const boardData = useTracker(() => {
        return BoardCollection.findOne({_id: boardId});
    });

    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    const handleAddStatus = (event) => {
        event.preventDefault();
        const newError = {}

        if (boardStatuses.map((status) => status.toLowerCase()).includes(boardNewStatusInput.toLowerCase().trim())) {
            newError.boardNewStatus = "Status has already been added";

        } else if (!boardNewStatusInput.trim()) {
            newError.boardNewStatus = "Please input a valid status";

        } else {
            setBoardStatuses(boardStatuses.toSpliced(boardStatuses.length - 1, 0, boardNewStatusInput.trim()));
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
        const isExist = boardExistingTags.some(tag => tag.tagName.toLowerCase() === boardNewTagName.toLowerCase().trim());
        const newError = {}
        if (isExist) {
            newError.boardNewTag = "Tag has already been added";

        } else if (!boardNewTagName.trim() || boardNewTagName === "...") {
            newError.boardNewTag = "Please input valid tag name";

        } else {
            setBoardExistingTags([...boardExistingTags, {tagName: boardNewTagName.trim(), tagColour: boardNewTagHex}]);
            setBoardNewTagName('');
            setBoardNewTagHex('#000000');
        }
        setErrors(newError)
    }

    const handleRemoveTag = (event, tagName, tagColour) => {
        event.preventDefault();
        setBoardExistingTags(boardExistingTags.filter(tag => !(tag.tagName === tagName && tag.tagColour === tagColour)));
    }

    const saveChanges = (event) => {
        event.preventDefault();
        setIsSubmitting(true); // Disable button when loading

        // reset the messages
        setUpdateSuccess(null)
        setDeleteMessage('')

        const newErrors = {};
        let isError = false;

        // board name
        if (!boardNameInput) {
            newErrors.boardName = "Please fill in your board name";
            isError = true;
        } else if (boardNameInput.length > 30) {
            newErrors.boardName = "Board name can not exceed 30 characters";
            isError = true
        }

        // board code
        const alphanumericRegex = /^[A-Za-z0-9]+$/i;
        if (!boardCodeInput) {
            newErrors.boardCode = "Please fill in your board code";
            isError = true;
        }  else if (!alphanumericRegex.test(boardCodeInput)) {
            newErrors.boardCode = "Board code can only contain letters and numbers";
            isError = true
        } else if (boardCodeInput.length > 10) {
            newErrors.boardCode = "Board code can not exceed 10 characters";
            isError = true
        }

        // board deadline
        let deadlineDateObject = new Date(boardDeadlineDateInput + 'T' + boardDeadlineTimeInput);
        if (!boardDeadlineDateInput || !boardDeadlineTimeInput) {
            newErrors.boardDeadline = "Please fill in your deadline date and time";
            isError = true;
        } else if (isNaN(deadlineDateObject)) {
            // deadline is invalid format
            newErrors.boardDeadline = "Deadline datetime is invalid";
            isError = true
        }

        // board description
        if (!boardDescriptionInput) {
            newErrors.boardDescription = "Please fill in your board description";
            isError = true;
        } else if (boardDescriptionInput.length > 150) {
            newErrors.boardDescription = "Board description can not exceed 150 characters";
            isError = true
        }


        // if status input has text, check user hasn't forgotten to press the + button
        if (boardNewStatusInput !== "") {
            newErrors.boardNewStatus = "You still have an unconfirmed status left in the input. " +
                "Please press the '+' to add it or clear the input.";
            isError = true
        }

        // if poll option has text, check user hasn't forgotten to press the + button
        if (boardNewTagName !== "") {
            newErrors.boardNewTag = "You still have an unconfirmed new tag left in the input. " +
                "Please press the '+' to add it or clear the input.";
            isError = true
        }

        setErrors(newErrors);

        if (!isError) {
            const boardStatusObject = boardStatuses.map((status, index) => {
                return {statusName: status, statusOrder: index}
            });

            const removedStatuses = boardData.boardStatuses.filter(
                status => !boardStatuses.includes(status.statusName)).map(
                status => status.statusName);

            const removedTags = boardData.boardTags.filter(
                tag => !boardExistingTags.some(
                existingTag => existingTag.tagName === tag.tagName)).map(
                tag => tag.tagName);

            new Promise((resolve, reject) => {
                Meteor.call('update_board', boardId,
                    {
                        boardName: boardNameInput,
                        boardCode: boardCodeInput,
                        boardDeadline: `${boardDeadlineDateInput}T${boardDeadlineTimeInput}`,
                        boardDescription: boardDescriptionInput,
                        teamId: boardData.teamId,
                        boardStatuses: boardStatusObject,
                        boardTags: boardExistingTags
                    },
                    userInfo.username,
                    (error) => {
                        if (error) {
                            reject(error)
                        } else {
                            Meteor.call('remove_deleted_statuses_tags',
                                boardId,
                                removedStatuses,
                                removedTags,
                                (err, res) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(res)
                                    // set success message
                                    setUpdateSuccess(true)

                                    // clear inputs
                                    setBoardNameInput('');
                                    setBoardCodeInput('');
                                    setBoardDeadlineTimeInput('');
                                    setBoardDeadlineDateInput('');
                                    setBoardDescriptionInput('');
                                    setBoardStatuses([]);
                                    setBoardExistingTags([]);
                                    setBoardNewTagName('');
                                    setBoardNewTagHex('#000000');
                                    setBoardNewStatusInput('');
                                    setErrors({});
                                }
                            })
                        }
                        setIsSubmitting(false); // Enable the button after loaded
                    });
            }).catch(() => {
                setUpdateSuccess(false)
            });
        } else {
            // errored
            setIsSubmitting(false); // Enable the button after loaded
        }
    }

    const deleteBoard = () => {
        new Promise((resolve, reject) => {
            Meteor.call('delete_board', boardId, userInfo.username, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                    navigate('/' + BaseUrlPath.TEAMS + "/" + teamId);
                }
            });
        }).catch(() => {
            setDeleteMessage("Deletion failed, please try again")
        })
    }
    const helpText = "This is the board settings page to modify board details and its statuses and tags. " +
        "You may also permanently delete the board.";

    if (isLoading) {
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    } else {

        // check user is in the team
        if (!teamData || !teamData.teamMembers.includes(userInfo.email)) {
            // user is not in team, or team does not exist, move them back to their teams list
            navigate('/' + BaseUrlPath.TEAMS)

        } else if (!boardData || teamId !== boardData.teamId) {
            // board does not exist OR not belong to that team, but team does
            navigate('/' + BaseUrlPath.TEAMS + '/' + teamId)
        }

        if (boardData && startCond) {
            setBoardNameInput(boardData.boardName);
            setBoardCodeInput(boardData.boardCode);
            setBoardDeadlineDateInput(boardData.boardDeadline.split('T')[0]);
            setBoardDeadlineTimeInput(boardData.boardDeadline.split('T')[1]);
            setBoardDescriptionInput(boardData.boardDescription);
            setBoardStatuses(boardData.boardStatuses.sort((a, b) => a.statusOrder - b.statusOrder).map(status => status.statusName));
            setBoardExistingTags(boardData.boardTags);
        }

        return (
            <>
                <WhiteBackground pageHelpText={helpText} pageLayout={PageLayout.LARGE_CENTER}>

                    <div className="header-space-between">
                        <Button className={"flex flex-row gap-2 btn-back"}
                                onClick={() => {
                                    navigate('/' + BaseUrlPath.TEAMS + "/" + teamId + "/boards/" + boardId);
                                }}>
                            {backLeftArrow}
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
                                    placeholder={"Max 30 characters"}
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
                                        id={"boardDeadlineDate"}
                                        value={boardDeadlineDateInput}
                                        onChange={(e) => setBoardDeadlineDateInput(e.target.value)}
                                    />
                                    <Input
                                        className={"short-input"}
                                        type="time"
                                        id={"boardDeadlineTime"}
                                        value={boardDeadlineTimeInput}
                                        onChange={(e) => setBoardDeadlineTimeInput(e.target.value)}
                                    />
                                </div>
                                {errors.boardDeadline &&
                                    <span className="text-red small-text">{errors.boardDeadline}</span>}
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
                                {boardStatuses && boardStatuses.length !== 0 ?
                                    boardStatuses.map((status) => {
                                        return (
                                            <div key={status} className={"status-item non-clickable"}>
                                                {status} {status.toLowerCase() === 'to do' || status.toLowerCase() === 'done' || status === '' ? null :
                                                <button className="icon-btn"
                                                        onClick={(e) => handleRemoveStatus(e, status)}>{removeIcon}</button>}
                                            </div>
                                        )
                                    }) :
                                    <span className={"small-text text-grey non-clickable"} style={{paddingTop: "3px"}}>There are no existing statuses</span>}
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
                                        onChange={(e) => setBoardNewStatusInput(e.target.value)}
                                    />
                                    <button className="icon-btn" onClick={(e) => handleAddStatus(e)}>
                                        {subAddIcon}
                                    </button>
                                </div>

                                {errors.boardNewStatus &&
                                    <span className="text-red small-text">{errors.boardNewStatus}</span>}
                            </div>
                        </div>

                        {/* Board tags display */}
                        <div className='settings-form-input' style={{alignItems: "start"}}>
                            <label className={"main-text text-grey"}>Tags:</label>
                            <div className={"tag-group"}>
                                {boardExistingTags && boardExistingTags.length !== 0 ?
                                    (boardExistingTags.map((tag) => {
                                        return (
                                            <div key={tag.tagName} className={"tag-item"}>
                                                {tag.tagName}
                                                <div className={"tag-circle"} style={{backgroundColor: tag.tagColour}}/>
                                                <button className="icon-btn"
                                                        onClick={(e) => handleRemoveTag(e, tag.tagName, tag.tagColour)}>{removeIcon}</button>
                                            </div>
                                        )
                                    })) :
                                    <span className={"small-text text-grey non-clickable"} style={{paddingTop: "3px"}}>There are no existing tags</span>}
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
                                    <button className="icon-btn" onClick={handleAddTag}>{subAddIcon}</button>
                                </div>

                                {errors.boardNewTag &&
                                    <span className="text-red small-text">{errors.boardNewTag}</span>}
                            </div>
                        </div>

                        {/* submit button */}
                        <Button className="btn-brown btn-submit"
                                type={"submit"}
                                disabled={isSubmitting}
                                onClick={(e) => saveChanges(e)}>
                            {saveIcon} Save Changes
                        </Button>
                        {updateSuccess === null ? null :
                            updateSuccess ?
                                <span className="text-green small-text non-clickable">Board has been updated!</span> :
                                <span
                                    className="text-red small-text non-clickable">Update failed, please try again.</span>
                        }
                    </form>

                    <div style={{
                        width: "100%",
                        minWidth: "100%",
                        maxWidth: "100%",
                        display: "flex",
                        justifyContent: "end"
                    }}>
                        <div style={{width: "fit-content"}}
                             className={"text-red underline clickable"}
                             onClick={onOpenModal}>
                            Delete Board
                        </div>
                    </div>

                </WhiteBackground>
                <Modal
                    closeIcon={closeModalIcon}
                    classNames={{modal: classNames('modal-base', '')}}
                    open={open}
                    onClose={onCloseModal}
                    center>
                    <div className={"modal-div-center"}>
                        <h1 className={"text-center"}>Delete Board?</h1>
                        <span>Are you sure you would like to delete the board?</span>
                        <div className={"main-text"}>This action will be recorded in the Logs.</div>
                        <div className={"main-text text-red"}>This action cannot be reverted.</div>
                        <div className={"button-group-row btn-submit"}>
                            <Button className={"btn-red"} onClick={deleteBoard}>Confirm</Button>
                            <Button className={"btn-grey"} onClick={onCloseModal}>Cancel</Button>
                        </div>
                        {deleteMessage && <span className="text-red small-text non-clickable">{deleteMessage}</span>}
                    </div>
                </Modal>
            </>
        );

    }
}

export default BoardSettings;