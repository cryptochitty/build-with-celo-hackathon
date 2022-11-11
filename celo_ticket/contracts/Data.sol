pragma solidity 0.8.17;
 
struct eventParticipant {
     bool received;
     string name;
     string email;
}
 
struct Event {
     string name;
     uint eventDate;
     address payable eventOwner;
     address eventNFT;
     bool mintStatus;
     bool approved;
     uint amount;
     mapping(address=>eventParticipant) participants;
}
