/**
 * File Description: Task Modal component for adding/Viewing tasks
 * File version: 1.1
 * Contributors: Sam, Nikki
 */

import React, {useState} from 'react';
import {Modal} from 'react-responsive-modal';
import {PlusIcon, XCircleIcon} from "@heroicons/react/24/outline";

import classNames from "classnames";
import Button from "../buttons/Button";
import Input from "../inputs/Input";
import '../../general/modal/modal.css'
import TaskPin from "../cards/TaskPin";
import TaskTag from "../cards/TaskTag";

const TaskModal = ({isOpen, onClose, boardId, taskData, tagsData, statusesData}) => {
    // State variables to manage the form inputs
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadlineDate, setDeadlineDate] = useState("");
    const [deadlineTime, setDeadlineTime] = useState("");
    const [isPinned, setIsPinned] = useState(false);
    const [status, setStatus] = useState("To Do");
    const [tagNames, setTagNames] = useState([]);
    const [contribution, setContribution] = useState("");

    const [errors, setErrors] = useState({
        title: '',
        description: '',
        deadlineDate: '',
        deadlineTime: '',
        status: '',
        tags: '',
        contribution: '',
    })

    // for date checking
    const minDeadlineDate = new Date();

    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35}/>

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        let deadlineDateObject = new Date(deadlineDate + 'T' + deadlineTime);

        const newTask = {
            taskName: title,
            taskDesc: description,
            taskDeadlineDate: deadlineDateObject,
            taskIsPinned: isPinned,
            boardId: boardId,
            statusName: status,
            tagNames: tagNames
        }

        Meteor.call("insert_task", newTask, contribution)

        onClose(); // Close the modal after submitting
    };

    const addTag = (value) => {
        if (!tagNames.includes(value)) {
            setTagNames(tagNames.concat(value))
        }
    }

    console.log(tagNames)

    const removeTag = (value) => {
        setTagNames(tagNames.filter(tagName => tagName !== value))
    }

    let displayText = null;
    if (taskData) {

        const taskDeadlineDate = new Date(taskData.taskDeadline);
        const today = new Date();
        let urgentStartDate = new Date();
        urgentStartDate.setTime(today.getTime() - 3 * 24 * 60 * 60 * 1000) // three before now after


        if (taskDeadlineDate <= today && taskData.taskStatus.toLowerCase() !== "done") {
            // after current datetime and NOT done
            displayText = "OVERDUE";
        } else if (taskDeadlineDate >= urgentStartDate && taskData.taskStatus.toLowerCase() !== "done") {
            displayText = "URGENT";
        }
    }

    const plusIcon = <PlusIcon strokeWidth={2} viewBox="0 0 24 24" width={25} height={25}
                               style={{paddingRight: "5px"}}/>;

    const addTagIcon = <PlusIcon color={"var(--navy)"} className={"clickable"}
                                 strokeWidth={2} viewBox="0 0 24 24" width={18} height={18}/>
    return (
        <Modal
            open={isOpen} // Control the visibility of the modal
            onClose={onClose} // Function to call when the modal should close
            closeIcon={closeIcon}
            center
            classNames={{
                modal: classNames('modal-base modal-large'),
            }}
        >

            <form className={"modal-div-center"} onSubmit={handleSubmit}>

                {/*top div*/}
                <div className={"task-modal-top"}>

                    {/* div with PIN and urgent/overdue text*/}
                    <div className={"header-space-between"}>

                        <div style={{width: "170px"}}>
                            <TaskPin isPinned={isPinned} onPinChange={setIsPinned} size={"35"}/>
                            <span className={"main-text text-grey non-clickable"}>Press to pin</span>
                        </div>

                        <h1 style={{color: "var(--dark-red)", marginRight: "25px"}}
                            className={"no-margin"}>{displayText}</h1>

                        <div style={{width: "170px"}}/>
                    </div>

                    {/* title of task */}
                    <Input
                        type="text"
                        style={{width: '80%', minWidth: "80%", maxWidth: "80%"}}
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                    />
                </div>

                <div className="task-modal-grid">

                    {/* left side description area */}
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        style={{minHeight: "300px", maxHeight: "450px", marginTop: "10px"}}
                        className={"input-base main-text"}
                    />

                    {/* right side */}
                    <div className="task-modal-right">

                        {/* Input field for board deadline */}
                        <div className='input-group-2col-full' style={{alignItems: "start"}}>
                            <label className={"main-text text-grey"} style={{marginTop: "6px"}}>Deadline:</label>

                            <div className={"input-error-div"}>
                                <Input
                                    type="date"
                                    style={{marginBottom: "6px"}}
                                    min={minDeadlineDate.toISOString().split('T')[0]}
                                    id={"boardDeadline"}
                                    value={deadlineDate}
                                    onChange={(e) => setDeadlineDate(e.target.value)}
                                />
                                <Input
                                    type="time"
                                    id={"boardDeadline"}
                                    value={deadlineTime}
                                    onChange={(e) => setDeadlineTime(e.target.value)}
                                />
                                {errors.boardDeadline &&
                                    <span className="text-red small-text">{errors.boardDeadline}</span>}
                            </div>
                        </div>

                        {/* status */}
                        <div className="input-group-2col-full">
                            <label className="main-text text-grey" htmlFor="status">Status:</label>
                            <select
                                id="status"
                                name="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="input-base"
                                required
                            >
                                {/* populate status based on database entry */}
                                <option value="To Do">To Do</option>
                                {statusesData ?
                                    statusesData
                                        .sort((a, b) => {
                                            return a.statusOrder - b.statusOrder;
                                        })
                                        .map((status, index) => (
                                            <option key={index} value={status.statusName}>{status.statusName}</option>
                                        )) : null
                                }
                                <option value="Done">Done</option>
                            </select>
                        </div>


                        {/* status */}
                        <div className="input-group-2col-full">
                            <label className="main-text text-grey" htmlFor="status">Tags:</label>


                            <div className={"inner-input-group-col"}>

                                <div className={"task-modal-tags-display"}>
                                    {
                                        tagNames.map((tagName) => {
                                            // here find the tag colour that matches this name
                                            const tagColour = tagsData.filter((tag) => {
                                                return tagName === tag.tagName
                                            })[0].tagColour;
                                            return (
                                                <TaskTag key={tagName} tagName={tagName} tagColour={tagColour}
                                                         editMode={true} xButtonHandler={() => removeTag(tagName)}
                                                />
                                            )
                                        })
                                    }
                                </div>


                                {/*div for displaying tag buttons to add*/}
                                <div className={"task-modal-tags-display"}>
                                    {/* populate tags based on database entry */}

                                    {
                                        tagsData ?
                                            tagsData.map((tag, index) => {

                                                    if (!tagNames.includes(tag.tagName)) {
                                                        return (
                                                            <button key={index} style={{backgroundColor: tag.tagColour}}
                                                                    onClick={(e) => addTag(tag.tagName)}
                                                                    className={"task-tag icon-btn"}
                                                            >
                                                                {tag.tagName}{addTagIcon}
                                                            </button>
                                                        )
                                                    } else {
                                                        return null;
                                                    }
                                                }
                                            ) : null
                                    }
                                </div>

                            </div>
                        </div>


                        <div className="form-group">
                            <input
                                type="text"
                                id="contribution"
                                name="contribution"
                                value={contribution}
                                onChange={(e) => setContribution(e.target.value)}
                                placeholder="Contribution"
                                className="task-modal-input"
                            />
                        </div>


                    </div>
                </div>

                <Button type="submit" className="btn-brown">
                    {plusIcon} Add Task
                </Button>
            </form>
        </Modal>
    );
};

export default TaskModal;
