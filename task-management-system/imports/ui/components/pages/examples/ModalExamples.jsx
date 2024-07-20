/**
 * File Description: Modal (popup) example
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React, {useState} from 'react';
import classNames from "classnames";
import {XCircleIcon} from "@heroicons/react/24/outline";
import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../../general/modal/modal.css'

import Button from "../../general/buttons/Button";

const ModalExamples = () => {
    const [open, setOpen] = useState(false);

    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35}/>

    return (
        <div>
            <Button className={"btn-brown"} onClick={onOpenModal}>Open modal</Button>

            <Modal
                closeIcon={closeIcon}
                classNames={{
                    modal: classNames('modal-base', ''),
                }}
                open={open}
                onClose={onCloseModal}
                center>

                <div>
                    <h2>Example model</h2>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non placerat urna. Sed et ipsum
                    vel leo volutpat scelerisque a vitae neque. Nunc rutrum posuere nunc nec aliquam. Aenean felis diam,
                    luctus eget massa sed, vehicula porta dui. Etiam augue purus, tincidunt eu nisl nec, posuere
                    pellentesque turpis. Curabitur mollis nunc porttitor ipsum porttitor eleifend. Cras dapibus
                    imperdiet tortor eu malesuada. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
                    per inceptos himenaeos. Vivamus vitae tincidunt enim. Duis sodales libero in massa fermentum
                    egestas. Pellentesque pellentesque, lacus in malesuada cursus, risus nisi viverra arcu, id efficitur
                    ex massa eu libero. Cras a turpis pulvinar, interdum leo at, ullamcorper lacus. Donec placerat
                    congue dui, ac porttitor urna tincidunt in. Mauris turpis ligula, gravida non lacus nec, aliquet
                    placerat velit.
                </div>
            </Modal>
        </div>
    );
};

export default ModalExamples;