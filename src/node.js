class Node {
	constructor(data, priority) {
		this.data = data;
		this.priority = priority;
		this.parent = null;
		this.left = null;
		this.right = null;
	}

	appendChild(node) {
		//If left is empty then left is node
		if(this.left === null) {
			this.left = node;
			node.parent = this;
		//Else If right is empty then right is node
		} else if(this.right === null) {
			this.right = node;
			node.parent = this;
		//Else Don't do anything
		} else {
			return;
		}
	}

	removeChild(node) {
		/*Функция глубокой проверки объектов */
		let deep = function deepEqual(a, b) {
			if(a === b) return true;
			if(a === null || typeof(a) != "object" || b === null || typeof(b) != "object") return false;

			let propInA = 0;
			let propInB = 0;

			for(let property in a) {
				propInA += 1;
			}

			for(let property in b) {
				propInB += 1;
				if(!(property in a) || !deepEqual(a[property], b[property])) return false;
			}

			return propInA === propInB;
		}
		/*Проверяем глубокой проверкой node с left and right
		и если есть совпадения, то присваиваем null тому child
		который совпал*/
		if(deep(node, this.left)) {
			this.left.parent = null;
			this.left = null;
		} else if(deep(node, this.right)) {
			this.right.parent = null;
			this.right = null;
		} else {
			throw new Error("There is not such child");
		}
	}

	remove() {
		if(!(this.parent === null)) {
			this.parent.removeChild(this);
		}
	}

	swapWithParent() {
		if(this.parent) {
			//Сохраняем все ссылки относительно текущего дерева
			let grandParent = this.parent.parent;
			let parent = this.parent;
			let parentRight = this.parent.right;
			let parentLeft = this.parent.left;
			let thLeft = this.left;
			let thRight = this.right;
			//Если есть левый ребёнок у this, тогда меняем ему родителя
			if(thLeft) thLeft.parent = parent;
			//Если есть правый ребёнок у this, тогда меняем ему родителя
			if(thRight) thRight.parent = parent;
			//Переопределяем детей родителя
			parent.left = thLeft;
			parent.right = thRight;
			parent.parent = this;
			//Проверка на то, каким this (левым или правым) является он у родителя
			if(parentLeft !== this) {
				this.left = parentLeft;
				parentLeft.parent = this;
				this.right = parent;
			} else {
				this.left = parent;
				this.right = parentRight;
				this.parent = parent.parent;
				if(parentRight) {
					parentRight.parent = this;
				}
			}
			//Проверка на то, есть ли прародитель у текущего this
			if(grandParent) {
				this.parent = grandParent;
				//Проверка на то, каким является родитель this у прародителя
				if(grandParent.right == parent) {
					grandParent.right = this;
				} else {
					grandParent.left = this;
				}
			} else {
				this.parent = null;
			}    
		}
	}
}

module.exports = Node;
