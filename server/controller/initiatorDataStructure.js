function Initiators() {
    this.list = {};
    this.head = false;
    this.tail = false;
}

function Node(sID, avail = true) {
    this.id = sID,
    this.available = avail,
    this.next = sID,
    this.prev = sID
}

Initiators.prototype.add = function(sID) {
    // List deconstruction
    list = this.list;
    // Make new node
    let newNode = new Node(sID);
    list[sID] = newNode;
    // If not first node
    if (this.head) {
        // Deconstruction
        head = this.head;
        tail = this.tail;
        // Add pointers from head/tail to this node
        list[tail].next = sID;
        // console.log('head is', head);
        list[head].prev = sID;
        // Add pointers from this node to head/tail
        newNode.next = head;
        newNode.prev = tail;  
        // Make new tail
        this.tail = sID;
    }  else { // If first node
        this.head = newNode.id;
        this.tail = newNode.id;
        newNode.next = sID;
        newNode.prev = sID;
    }
}

Initiators.prototype.remove = function(sID) {
    // console.log('Removing', sID);
    // Deconstruction
    list = this.list;
    tail = this.tail;
    head = this.head;
    // Get linked IDs
    let prev = list[sID].prev;
    let next = list[sID].next;
    if (next === sID) { 
        // If only node, remove head/tail/nextUp
        this.head = false;
        this.tail = false;
    } else {
        // Change links
        if (tail === sID) this.tail = prev;
        if (head === sID) this.head = next;
        // Get linked nodes
        let prevNode = list[prev];
        let nextNode = list[next];
        prevNode.next = next;
        nextNode.prev = prev;
    }
    // Remove
    delete list[sID];
}

module.exports = Initiators;