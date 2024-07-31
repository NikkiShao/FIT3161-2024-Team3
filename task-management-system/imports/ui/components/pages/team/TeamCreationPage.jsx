/**
 * File Description: Examples page
 * Updated Date: 20/07/2024
 * Contributors: Mark
 * Version: 1.0
 */

import React, {useState} from 'react';
import classNames from "classnames";
import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../../general/modal/modal.css'

import {XCircleIcon, TrashIcon, PlusCircleIcon} from "@heroicons/react/24/outline";

import Input from "../../general/inputs/Input";
import Button from "../../general/buttons/Button";

import "./team.css"

export const TeamCreationPage = () => {

    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState(['creeper@qq.com', 'cc@cc.com']);
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35} />;
    const trashIcon = <TrashIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={20} height={20} />;
    const plusIcon = <PlusCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={20} height={20} />;

    const handleAddMember = () => {
        if (emailRegex.test(email) && !members.includes(email)) {
            setMembers([...members, email]);
            setEmail('');
            setError('');
        } else {
            setError('Invalid or duplicate email address');
        }
    };

    const handleRemoveMember = (emailToRemove) => {
        setMembers(members.filter(member => member !== emailToRemove));
    };

    const handleCreateTeam = () => {
        if (teamName && members.length > 0) {
            console.log('Team Created:', { teamName, members });
            setTeamName('');
            setMembers([]);
            setOpen(false);
            setError('');
        } else {
            setError('Team name and members are required');
        }
    };

    return (
        <>
            <Button className={"btn-brown"} onClick={onOpenModal}>Create Team</Button>

            <Modal
                closeIcon={closeIcon}
                classNames={{
                    modal: classNames('modal-base', ''),
                }}
                open={open}
                onClose={onCloseModal}
                center>
                <h1>Create New Team</h1>
                {error && 
                <div className='inputGroup'>
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
                }
                <div className='inputGroup'>
                    <label className="inputGroup-label">Team Name:</label>
                    <Input
                        className="input"
                        type="text"
                        placeholder="Enter your team name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                </div>

                <div className='inputGroup'>
                    <label className="inputGroup-label">Invite Members:</label>
                    {
                        members.map((member, index) => (
                            <div key={index} className="memberItem">
                                {member}
                                <button className="insertedButton" onClick={() => handleRemoveMember(member)}>
                                    {trashIcon}
                                </button>
                            </div>
                        ))
                    }
                </div>

                <div className='inputGroup'>
                    <Input
                        className="input"
                        type="email"
                        placeholder="Enter Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="insertedButton" onClick={handleAddMember}>
                        {plusIcon}
                    </button>
                </div>

                <div className='buttonGroup'>
                    <Button
                        className="buttomButton"
                        onClick={handleCreateTeam}>
                        Create Team
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default TeamCreationPage;
