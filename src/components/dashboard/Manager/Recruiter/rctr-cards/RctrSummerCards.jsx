import React from "react";
import Card from "./RctrSummaryCard";

const RctrSummerCards = ({ cardsData }) => {
    const cardData = [
        {
            type: "opening",
            value: cardsData?.job_postings_count,
            label: "Job Opening",
        },
        {
            type: "positions",
            value: cardsData?.job_postings_count,
            label: "No of Positions",
        },
        {
            type: "candidates",
            value: cardsData?.applications_count,
            label: "Candidates Sent",
        },
        {
            type: "interview",
            value: cardsData?.interviews_count,
            label: "Invited for Interview",
        },
        {
            type: "feedback",
            value: cardsData?.pending_candidates_count,
            label: "Waiting for Feedbacks",
        },
        {
            type: "hired",
            value: cardsData?.joined_candidates_count,
            label: "Hired",
        },
    ];

    return (
        <div className="w-full py-4 flex flex-wrap gap-4 justify-center">
            {cardData.map((card, index) => (
                <Card
                    key={index}
                    type={card.type}
                    value={card.value}
                    label={card.label}
                />
            ))}
        </div>
    );
};

export default RctrSummerCards;
