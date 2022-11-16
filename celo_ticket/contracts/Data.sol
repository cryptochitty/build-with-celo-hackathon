// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;
 
struct eventParticipant {
     bool received;
     string name;
     string email;
}
 
struct EventDetail {
     string name;
     uint eventDate;
     address payable eventOwner;
     bool mintStatus;
     bool approved;
}
