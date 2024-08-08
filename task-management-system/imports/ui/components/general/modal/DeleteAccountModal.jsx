/**
 * File Description: Account Deletion modal component
 * Updated Date: 05/08/2024
 * Contributors: Mark
 * Version: 1.0
 */


// import React from 'react';
// import { Modal } from 'react-responsive-modal';
// import classNames from "classnames";
// import {PlusCircleIcon, TrashIcon, XCircleIcon} from "@heroicons/react/24/outline";
// import { Button } from 'react-bootstrap';
// import '../../general/modal/modal.css';


// const DeleteAccountModal = () => {
//     const [open, setOpen] = React.useState(false);
//     const onOpenModal = () => setOpen(true);
//     const onCloseModal = () => setOpen(false);
//     const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35}/>

//     return (
//         <div>
//             <Button className={"btn-brown"} onClick={onOpenModal}>Delete Account</Button>
//             <Modal
//                 closeIcon={closeIcon}
//                 classNames={{
//                     modal: classNames('modal-base', ''),
//                 }}
//                 open={open}
//                 onClose={onCloseModal}
//                 center>
//                 <div>
//                     <h2>Are you sure you want to delete your account?</h2>
//                     <Button className={"btn-brown"}>Yes</Button>
//                     <Button className={"btn-brown"} onClick={onCloseModal}>No</Button>
//                 </div>
//             </Modal>
//         </div>
//     );
// }