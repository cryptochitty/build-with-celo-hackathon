// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;
import "./Data.sol";
 
contract EventManager {
     mapping(address=>bool) public owners;
     mapping(uint => EventDetail) public upcomingEvents;
     mapping(uint => EventDetail) public approvedEvents;
     
     uint public nextId;
     constructor(address _owner) {
         owners[_owner] = true;
         nextId = 10000000;
     }
 
     function addOwner(address _newOwner) isOwner(msg.sender) external  {
         require(owners[_newOwner] != true, 'address already exists');
         owners[_newOwner] = true;
     }
          
     function registerEvent(string calldata _name, address payable _eventOwner, uint _eventDate) external {
            require(_eventDate > block.timestamp, 'can only organize event for a future date');
            EventDetail memory newEventDetail = EventDetail({ name: _name,
                eventOwner:_eventOwner,
                eventDate: _eventDate,
                mintStatus: false,
                approved:false
            });
            upcomingEvents[nextId] = newEventDetail;
            nextId++;
     }

     function getEvent(uint _eventId) eventExist(_eventId) view external returns(EventDetail memory) {
        EventDetail storage existingEventDetail = upcomingEvents[_eventId];
        return existingEventDetail;
     }

     function getApprovedEvent(uint _eventId) IsApprovedEvent(_eventId) view external returns(EventDetail memory) {
        EventDetail storage approvedEventDetail = approvedEvents[_eventId];
        return approvedEventDetail;
     }
 
     function approveEvent(uint _eventId) isOwner(msg.sender) eventExist(_eventId) external  {
        EventDetail storage eventToApprove = upcomingEvents[_eventId];
        eventToApprove.approved =  true;
        approvedEvents[_eventId] = eventToApprove;
        delete upcomingEvents[_eventId];
     }
 
     modifier isOwner(address _owner) {
        require(owners[_owner] = true, 'Not a owner');
        _;
     }
 
     modifier eventExist(uint _eventId) {
        require(_eventId > 0, "Invalid bounds");
        require(upcomingEvents[_eventId].eventDate != 0, 'Event does not exist or already approved');
        _;
     }

     modifier IsApprovedEvent(uint _eventId) {
        require(_eventId > 0, "Invalid bounds");
        require(approvedEvents[_eventId].eventDate != 0 && approvedEvents[_eventId].approved == true, 'Event does not exist or is not approved');
        _;
     }
}
