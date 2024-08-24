/**
 * File Description: Task Modal component for adding/Viewing tasks
 * File version: 1.2
 * Contributors: Sam, Nikki
 */

import React, {useState} from 'react';
import {Modal} from 'react-responsive-modal';
import {CheckIcon, MinusCircleIcon, PlusIcon, XCircleIcon} from "@heroicons/react/24/outline";

import classNames from "classnames";
import Button from "../buttons/Button";
import Input from "../inputs/Input";
import '../../general/modal/modal.css'
import TaskPin from "../cards/TaskPin";
import TaskTag from "../cards/TaskTag";
import {useSubscribe, useTracker} from "meteor/react-meteor-data";
import TaskCollection from "../../../../api/collections/task";

/**
 * Task modal to view/edit or create tasks
 *
 * @param isOpen - is modal is open
 * @param onClose - handler for closing modal
 * @param boardId - ID of the current board
 * @param taskId - ID of the task to view, null if new task
 * @param tagsData - list of tags
 * @param statusesData - list of statuses
 * @param membersData - list of user data of all team members
 * @returns {Element} - task modal JSX element
 */
const TaskModal = ({isOpen, onClose, boardId, taskId, tagsData, statusesData, membersData}) => {
    // State variables to manage the form inputs
    const [modalTaskId, setModalTaskId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadlineDate, setDeadlineDate] = useState("");
    const [deadlineTime, setDeadlineTime] = useState("23:55");
    const [isPinned, setIsPinned] = useState(false);
    const [status, setStatus] = useState("To Do");
    const [tagNames, setTagNames] = useState([]);
    const [contributions, setContributions] = useState({});

    const isLoadingTasks = useSubscribe('all_board_tasks', taskId);
    const isLoading = isLoadingTasks();

    const taskData = useTracker(() => {
        return TaskCollection.find({_id: taskId}).fetch()[0];
    })

    const [errors, setErrors] = useState({
        title: '',
        description: '',
        deadline: '',
        contributions:'',
        overall: ''
    })

    // for date checking
    const minDeadlineDate = new Date();

    // handler for modal close
    const modalCloseClearInputs = () => {
        setModalTaskId(null)
        setTitle('')
        setDescription('')
        setDeadlineTime('23:55')
        setDeadlineDate('')
        setIsPinned(false)
        setStatus("To Do")
        setTagNames([])
        setContributions({})
        setErrors({})
        onClose()
    }

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        let newErrors = {}
        let isError = false;

        // title
        if (!title) {
            newErrors.title = "Please fill in the title";
            isError = true
        } else if (title.length > 100) {
            newErrors.title = "Task title can not exceed 100 characters";
            isError = true
        }

        // description
        if (!description) {
            newErrors.description = "Please fill in the description";
            isError = true
        }

        // deadline
        let deadlineDateObject = new Date(deadlineDate + 'T' + deadlineTime);
        if (!deadlineDate || !deadlineTime) {
            newErrors.deadline = "Please fill in the task deadline";
            isError = true
        } else if (!taskId && deadlineDateObject < new Date()) {
            // NEW TASK and deadline is passed, invalid
            newErrors.deadline = "Deadline must be in the future";
            isError = true
        }

        // contribution > 100, error
        let totalContribution = 0;
        for (let key in contributions) {
            if (contributions.hasOwnProperty(key)) {
                totalContribution += Number(contributions[key])
            }
        }
        if (totalContribution > 100) {
            newErrors.contributions = "Total contribution must be no more than 100%";
            isError = true
        }

        setErrors(newErrors)

        if (!isError) {

            let contributionArr = []
            for (let key in contributions) {
                if (contributions.hasOwnProperty(key)) {
                    let entry = { email: key }
                    try {
                        entry.percent = Number(contributions[key])
                    } catch (e) {
                        entry.percent = 0
                    }
                    contributionArr.push(entry);
                }
            }

            const newTask = {
                _id: taskId, // this will be null if it is a new task
                taskName: title,
                taskDesc: description,
                taskDeadlineDate: deadlineDate + 'T' + deadlineTime,
                taskIsPinned: isPinned,
                boardId: boardId,
                statusName: status,
                tagNames: tagNames,
                contributions: contributionArr
            }

            if (taskId) {
                // edit mode
                new Promise((resolve, reject) => {
                    Meteor.call('insert_edit_task', newTask, false,
                        (error, result) => {
                            if (error) {
                                reject(`Error: ${error.message}`);

                            } else {
                                resolve(result);
                                modalCloseClearInputs(); // Close the modal after submitting
                            }
                        });
                }).catch(() => {
                    const newError = {}
                    newError.overall = "Modification failed: please try again";
                    setErrors(newError)
                })

            } else {
                // add mode
                new Promise((resolve, reject) => {
                    Meteor.call('insert_edit_task', newTask, true,
                        (error, result) => {
                            if (error) {
                                reject(`Error: ${error.message}`);

                            } else {
                                resolve(result);
                                modalCloseClearInputs(); // Close the modal after submitting
                            }
                        });
                }).catch(() => {
                    const newError = {}
                    newError.overall = "Creation failed: please try again";
                    setErrors(newError)
                })
            }
        }
    };

    // handler for adding a tag
    const addTag = (event, value) => {
        event.preventDefault();

        if (!tagNames.includes(value)) {
            setTagNames(tagNames.concat(value))
        }
    }

    // handler for removing a tag
    const removeTag = (event, value) => {
        event.preventDefault();
        setTagNames(tagNames.filter(tagName => tagName !== value))
    }

    // handler for adding contributions
    const addContribution = (event, email, value) => {
        event.preventDefault();
        if (!value) {
            value = '0'
        }

        if (value > 100) {
            value = '100'
        }

        setContributions({
            ...contributions,
            [email]: value,
        })
    }

    // handler for removing contributions
    const removeContribution = (event, email) => {
        event.preventDefault();

        const newContribution = Object.keys(contributions)
            .filter(objKey => objKey !== email)
            .reduce((newObj, key) => {
                    newObj[key] = contributions[key];
                    return newObj;
                }, {}
            );
        setContributions(newContribution)
    }

    // icons
    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35}/>

    const plusIcon = <PlusIcon strokeWidth={2} viewBox="0 0 24 24" width={25} height={25}
                               style={{paddingRight: "5px"}}/>;
    const saveIcon = <CheckIcon strokeWidth={2} viewBox="0 0 24 24" width={25} height={25}
                                style={{paddingRight: "5px"}}/>;

    const addTagIcon = <PlusIcon color={"var(--navy)"} className={"clickable"}
                                 strokeWidth={2} viewBox="0 0 24 24" width={18} height={18}/>

    const minusIcon = <MinusCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 24 24" width={30}
                                       height={30}/>;

    // all delete task modal stuff
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const onOpenDeleteModal = () => setDeleteModalOpen(true);
    const onCloseDeleteModal = () => setDeleteModalOpen(false);

    // handler for deleting task
    const handleDeleteTask = () => {
        new Promise((resolve, reject) => {
            Meteor.call('delete_task', taskId,
                (error, result) => {
                    if (error) {
                        reject(`Error: ${error.message}`);

                    } else {
                        resolve(result);
                        // Close the modals after deleting
                        modalCloseClearInputs();
                    }
                });
        }).catch(() => {
            const newError = {}
            newError.overall = "Deletion failed: please try again";
            setErrors(newError)
        })
        onCloseDeleteModal();
    }

    // waiting for loading
    if (!isLoading) {

        if (taskId && taskId !== modalTaskId) {

            setModalTaskId(taskId)
            setTitle(taskData.taskName)
            setDescription(taskData.taskDesc)
            setDeadlineDate(taskData.taskDeadlineDate.split("T")[0])
            setDeadlineTime(taskData.taskDeadlineDate.split("T")[1].substring(0, 12))
            setIsPinned(taskData.taskIsPinned)
            setStatus(taskData.statusName)
            setTagNames(taskData.tagNames)

            // map out contributions
            const newContributions = {}
            for (let i = 0; i < taskData.contributions.length; i++) {
                newContributions[taskData.contributions[i]["email"]] = taskData.contributions[i]["percent"]
            }
            setContributions(newContributions)
        }

        let displayText = null;
        if (taskData) {
            const today = new Date();
            const taskDeadlineDate = new Date(taskData.taskDeadlineDate);
            let urgentStartDate = new Date();
            urgentStartDate.setTime(taskDeadlineDate.getTime() - 3 * 24 * 60 * 60 * 1000) // three before now after

            if (today >= taskDeadlineDate && taskData.statusName.toLowerCase() !== "done") {
                // after current datetime and NOT done
                displayText = "OVERDUE";
            } else if (today >= urgentStartDate && taskData.statusName.toLowerCase() !== "done") {
                displayText = "URGENT";
            }
        }

        // check if there is any team member's contribution not added, display their options if so
        const allMembersAdded = membersData.filter((member) => contributions[member.emails[0].address] === undefined).length === 0;

        return (
            <div>

                <Modal
                    open={isOpen} // Control the visibility of the modal
                    onClose={modalCloseClearInputs} // Function to call when the modal should close
                    closeIcon={closeIcon}
                    center
                    classNames={{
                        modal: classNames('modal-base modal-large'),
                    }}
                >

                    <form className={"modal-div-center"} onSubmit={handleSubmit}>

                        {/*top div*/}
                        <div id={"task-modal__top"}>

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
                            <div className={"input-error-div"}>
                                <Input
                                    type="text"
                                    style={{
                                        width: '80%',
                                        minWidth: "80%",
                                        maxWidth: "80%",
                                        marginLeft: "10%",
                                        marginRight: "10%"
                                    }}
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Title"
                                />
                                {errors.title &&
                                    <span className="text-red small-text"
                                          style={{marginLeft: "10%"}}>{errors.title}</span>}
                            </div>
                        </div>

                        <div id="task-modal__grid">

                            {/* left side description area */}
                            <div className={"input-error-div"}>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            style={{minHeight: "300px", maxHeight: "450px", marginTop: "10px"}}
                            className={"input-base main-text"}
                        />
                                {errors.description &&
                                    <span className="text-red small-text">{errors.description}</span>}
                            </div>
                            {/* right side */}
                            <div id="task-modal__right">

                                {/* Input field for deadline */}
                                <div className='input-group-2col-full' style={{alignItems: "start"}}>
                                    <label className={"main-text text-grey"}
                                           style={{marginTop: "6px"}}>Deadline:</label>

                                    <div className={"input-error-div"}>
                                        <Input
                                            type="date"
                                            style={{marginBottom: "6px"}}
                                            min={minDeadlineDate.toISOString().split('T')[0]}
                                            id={"deadlineDate"}
                                            value={deadlineDate}
                                            onChange={(e) => setDeadlineDate(e.target.value)}
                                        />
                                        <Input
                                            type="time"
                                            id={"deadlineTime"}
                                            value={deadlineTime}
                                            onChange={(e) => setDeadlineTime(e.target.value)}
                                        />
                                        {errors.deadline &&
                                            <span className="text-red small-text">{errors.deadline}</span>}
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
                                    >
                                        {/* populate status based on database entry */}
                                        {statusesData ?
                                            statusesData
                                                .sort((a, b) => {
                                                    return a.statusOrder - b.statusOrder;
                                                })
                                                .map((status, index) => (
                                                    <option key={index}
                                                            value={status.statusName}>{status.statusName}</option>
                                                )) : null
                                        }
                                    </select>
                                </div>


                                {/* tags */}
                                <div className="input-group-2col-full" style={{alignItems: "start"}}>
                                    <label className="main-text text-grey" htmlFor="status">Tags:</label>

                                    {
                                        !tagsData || tagsData.length === 0 ?
                                            <span className={"small-text text-grey"}>There are no tags for this board.
                                                You can add tags in the board settings</span> :
                                            <div id={"task-modal__tags-group"}>
                                                <div className={"task-modal__tags-display"}>
                                                    {
                                                        tagNames.map((tagName) => {
                                                            // here find the tag colour that matches this name
                                                            const tagColour = tagsData.filter((tag) => {
                                                                return tagName === tag.tagName
                                                            })[0].tagColour;
                                                            return (
                                                                <TaskTag key={tagName} tagName={tagName}
                                                                         tagColour={tagColour}
                                                                         editMode={true}
                                                                         xButtonHandler={(e) => removeTag(e, tagName)}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </div>

                                                <hr id={"task-modal__hr"}/>

                                                {/*div for displaying tag buttons to add*/}
                                                <div className={"task-modal__tags-display"}>
                                                    {/* populate tags based on database entry */}
                                                    {
                                                        tagsData ? tagsData.map((tag, index) => {
                                                            if (!tagNames.includes(tag.tagName)) {
                                                                return (
                                                                    <button key={index}
                                                                            style={{backgroundColor: tag.tagColour}}
                                                                            onClick={(e) => addTag(e, tag.tagName)}
                                                                            className={"task-tag icon-btn"}
                                                                    >
                                                                        {tag.tagName}{addTagIcon}
                                                                    </button>
                                                                )
                                                            } else {
                                                                return null;
                                                            }
                                                        }) : null
                                                    }
                                                </div>
                                            </div>
                                    }

                                </div>

                                {/* contribution section */}
                                <div id={"task-modal__contribution"}>
                                    <label className="main-text text-grey" htmlFor="status">Contribution</label>

                                    {/* here display all EXISTING member's contributions */}
                                    {
                                        membersData ? membersData
                                            .filter((member) => {
                                                return contributions[member.emails[0].address] !== undefined;
                                            })
                                            .map((member) => {
                                                const memberEmail = member.emails[0].address;
                                                const existingPercentage = contributions[memberEmail];

                                                return (
                                                    <div key={member.username} id={"task-modal__contribution-grid"}>
                                                        {member.profile.name}
                                                        <div id={"task-modal__percent"}>
                                                            <Input
                                                                className={"input-tiny"}
                                                                type="number"
                                                                min={0}
                                                                max={100}
                                                                id={"contributionPct"}
                                                                value={existingPercentage ? existingPercentage : ''}
                                                                onChange={(e) => addContribution(e, memberEmail, e.target.value)}
                                                            />
                                                            <span className={"main-text text-grey"}>%</span>
                                                        </div>
                                                        <button className={"icon-btn"} onClick={(e) => {
                                                            removeContribution(e, memberEmail)
                                                        }}>
                                                            {minusIcon}
                                                        </button>
                                                    </div>
                                                )

                                            }) : null
                                    }

                                    {/* options to add contribution */}
                                    {
                                        allMembersAdded ? null :
                                            <select
                                                id="newContribution"
                                                name="newContribution"
                                                value={""}
                                                onChange={(e) => {
                                                    addContribution(e, e.target.value);
                                                    let self = document.getElementById("newContribution");
                                                    self.value = "default"
                                                }}
                                                className="input-base"
                                            >
                                                <option key={"none"} value={"default"}>Add contribution</option>
                                                {/* populate team members based on database entry */}
                                                {membersData ? membersData
                                                    .filter((member) => {
                                                        return contributions[member.emails[0].address] === undefined;
                                                    })
                                                    .map((member, index) => (
                                                        <option key={index}
                                                                value={member.emails[0].address}>{member.profile.name}</option>
                                                    )) : null
                                                }
                                            </select>}

                                    {errors.contributions && <span className="text-red small-text">{errors.contributions}</span>}
                                </div>
                            </div>
                        </div>

                        {errors.overall && <span className="text-red small-text">{errors.overall}</span>}

                        {
                            taskId ?
                                <Button type="submit" className="btn-brown btn-submit">
                                    {saveIcon} Save Changes
                                </Button> :
                                <Button type="submit" className="btn-brown btn-submit">
                                    {plusIcon} Add Task
                                </Button>
                        }

                    </form>

                    { taskId ?
                        <div style={{width: "100%", minWidth: "100%", maxWidth: "100%", textAlign: "right"}}
                             className={"text-red underline clickable"}
                             onClick={onOpenDeleteModal}
                        >Delete Task
                        </div> : null
                    }

                </Modal>

                {/* delete modal */}
                <Modal
                    open={deleteModalOpen} // Control the visibility of the modal
                    onClose={onCloseDeleteModal} // Function to call when the modal should close
                    closeIcon={closeIcon}
                    center
                    classNames={{
                        modal: classNames('modal-base'),
                    }}
                >
                    <div className={"modal-div-center"}>
                        <h1>Delete Task?</h1>
                        <div className={"main-text"}>Are you sure you would like to delete the task?</div>
                        <div className={"main-text"}>This action will be recorded in the Logs.</div>
                        <div className={"main-text text-red"}>This action cannot be reverted.</div>

                        <div className={"button-group-row btn-submit"}>
                            <Button className="btn-red" onClick={handleDeleteTask}>Delete</Button>
                            <Button className="btn-grey" onClick={onCloseDeleteModal}>Cancel</Button>
                        </div>
                    </div>
                </Modal>
            </div>


        );
    }
};

export default TaskModal;
