//Testing purposes only

import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { BoardCollection } from '/imports/api/collections/board.js';
import BoardCard from './BoardCard';
import './BoardCard.css';

const BoardListPage = () => {
    const { boards, isLoading } = useTracker(() => {
        const boardsHandle = Meteor.subscribe('all_boards');
        const isLoading = !boardsHandle.ready();
        const boards = BoardCollection.find().fetch();
        console.log('Fetched boards:', boards); // Debugging log
        return { boards, isLoading };
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="board-list-container">
            {boards.map(board => (
                <BoardCard
                    key={board._id._str || board._id}
                    boardName={board.board}
                    boardNickname={board.boardNickname}
                    boardDesc={board.boardDesc}
                    boardDeadline={board.boardDeadline}
                />
            ))}
        </div>
    );
};

export default BoardListPage;
