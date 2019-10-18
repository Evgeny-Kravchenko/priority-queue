const MaxHeap = require('./max-heap.js');

class PriorityQueue {
	constructor(maxSize) {
	 this.maxSize = maxSize || 30;
	 this.heap = new MaxHeap();
	}
  
	push(data, priority) {
	  if(data < this.maxSize) {
		this.heap.push(data, priority);
	  } else {
		  throw new Error();
	  }
	}
  
	shift() {
		if(this.isEmpty()) throw new Error();
		return this.heap.pop();
	}
  
	size() {
	  return this.heap.size();
	}
  
	isEmpty() {
	  return this.heap.isEmpty();
	} 
}  

module.exports = PriorityQueue;
