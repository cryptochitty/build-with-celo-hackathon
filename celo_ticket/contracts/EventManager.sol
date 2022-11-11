pragma solidity 0.8.17;
import "./Data.sol";
 
contract EventManager {
     mapping(address=>bool) public owners;
     mapping(uint => Event) public upcomingEvents;
     mapping(uint => Event) public newEvents;
     uint public nextId;
     constructor(address _owner) {
         owners[_owner] = true;
         nextId = 10000000;
     }
 
     function addOwner(address _newOwner) isOwner(msg.sender)  external  {
         require(owners[_newOwner] != true, 'address already exists');
         owners[_newOwner] = true;
     }
          
     function registerEvent(string calldata _name, address payable _eventOwner, uint _eventDate) external {
            require(_eventDate > block.timestamp, 'can only organize event at a future date');
            Event storage newEvent = newEvents[nextId++];
            newEvent.name = _name;
            newEvent.eventOwner = _eventOwner;
            newEvent.eventDate = _eventDate;
            newEvent.mintStatus = false;
            newEvent.approved = false;
     }
 
     function approveEvent(uint _eventId) isOwner(msg.sender) isNonApprovedEvent(_eventId) external {
        Event storage eventToApprove = newEvents[_eventId];
        eventToApprove.approved =  true;
        delete newEvents[_eventId];
     }
 
     modifier isOwner(address _owner) {
        require(owners[_owner] = true, 'Not a owner');
        _;
     }
 
     modifier isNonApprovedEvent(uint _eventId) {
        require(newEvents[_eventId].eventDate != 0, 'Event does not exist');
        _;
     }
 
}
