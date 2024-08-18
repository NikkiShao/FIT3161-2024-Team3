import React from "react";
import WhiteBackground from "../general/whiteBackground/WhiteBackground";
import PageLayout from "../../enums/PageLayout";
import PollCard from "../../components/general/cards/PollCard"; 
const Draft = () => {
  const options = [
      {
        "optionId": "66bcefd341b0745a2e33834d",
        "optionText": "someOne",
        "voterIds": [
          "66bcf17941b0745a2e338351",
          "66bcf18041b0745a2e338352"
        ]
      },
      {
        "optionId": "66bcf10541b0745a2e33834f",
        "optionText": "someTwo",
        "voterIds": [
          "66bcf18d41b0745a2e338353",
          "66bcf18f41b0745a2e338354"
        ]
      },
      {
        "optionId": "66bcf11041b0745a2e338350",
        "optionText": "somethree",
        "voterIds": [
          "EtbdgpSfjxNG9ZriT"
        ]
      }
    ]


  return (
    <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
      <h1>Draft Page</h1>
        <div>
          <PollCard
            title="Choose your favorite design"
            startTime="2023-09-19T19:20:00.000+00:00"
            closeTime="2024-10-21T22:55:00.000+00:00"
            options={options}
          />
        </div>
    </WhiteBackground>

  );
};

export default Draft;