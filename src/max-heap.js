const Node = require('./node');

class MaxHeap {
    constructor() {
        this.root = null;
        this.parentNodes = [];
        this._count = 0;
    }

    push(data, priority) {
        let node = new Node(data, priority);
        this.insertNode(node);
        this.shiftNodeUp(node);
        this._count++;
    }

    detachRoot() {
        let root = this.root;
        this.root = null;
        if(this.parentNodes[0] === root) this.parentNodes.shift();
        return root;
    }

    restoreRootFromLastInsertedNode(detached) {
      if(!detached.left && !detached.right) {
        return;
      }
        //Получаем последний добавленный элемент и удаляем его из масисва
        let lastInsertNode = this.parentNodes.pop();
        //Сохраняем родителя detached
        let lastInsertNodeParent;
        //Присваиваем удалённый из массива элемент в качестве root
        this.root = lastInsertNode;
        lastInsertNodeParent = lastInsertNode.parent;
        //Обнуляем родителя, так как у root нету родителя, так как это корень
        this.root.parent = null;
        /*Если удалённый элемент из массива является ребёнком нашего удалённого root,
        то определяем каким ребёнком он был detached у root и
        переопределяем соответствующую связь detached с 
         детьми бывшего root */
        if(detached.left === lastInsertNode || detached.right === lastInsertNode) {
            if(detached.left !== lastInsertNode) {
                this.root.left = detached.left;
                if(detached.left) detached.left.parent = this.root;
                detached.left.parent = this.root;
            } else if(detached.right !== lastInsertNode) {
                this.root.right = detached.right;
                if(detached.right) detached.right.parent = this.root;
                //Шифтим родителя в начало массива
                this.parentNodes.unshift(lastInsertNodeParent);
            }
            this.parentNodes.unshift(lastInsertNode);
            /*В противном случае просто переопределяем все
            ссылки детей бывшего root с detached*/
        } else {
            if(lastInsertNodeParent.left === lastInsertNode) {
            lastInsertNodeParent.left = null;
          } else if(lastInsertNodeParent.right === lastInsertNode) {
            lastInsertNodeParent.right = null;
          }
            this.root.left = detached.left;
            detached.left.parent = this.root;
            this.root.right = detached.right;
            detached.right.parent = this.root;
            if(lastInsertNodeParent && lastInsertNodeParent !== this.parentNodes[0]) {
                this.parentNodes.unshift(lastInsertNodeParent);
            }
        }
    }

    size() {
        return this._count;
    }

    isEmpty() {
        if(this.root) return false;
        return true;
    }

    clear() {
        this.root = null;
        this.parentNodes = [];
        this._count = 0;
    }

    insertNode(node) {
        /*Если куча пустая, то делаем её верхушкой root
        и кладём в массив parentNodes для удобства доступа*/
        if(this.parentNodes.length === 0) {
            this.root = node;
            this.parentNodes.push(node);
        } else {
        /*Если куча не пустая, то последующие элементы добавляем в предыдущий*/
        this.parentNodes[0].appendChild(node);
        this.parentNodes.push(node);
        /*Если у предыдущего элемента нету свободных детей,
        то удаляем первый элемент массива. Таким образом мы спустимся
        на один уровень по дереву*/
        if(this.parentNodes[0].left !== null && this.parentNodes[0].right !== null) {
            this.parentNodes.shift();
        }
        }
    }

    shiftNodeUp(node) {
        if(node.parent === null) {
            //Присваимваем для root node
            this.root = node;
            //Фильтруем массив на свободные left or right
            this.parentNodes = this.parentNodes.filter(function(index) {
                return !index.left || !index.right;
            });
            //Выходим из метода
        } else if(node.priority > node.parent.priority) {
            //Добавляем в начало массива root
            if(this.parentNodes[0] !== this.root) {
                this.parentNodes.unshift(this.root);
            }
            //Меняем место родителя и node в массиве
            let indexParent = this.parentNodes.indexOf(node.parent);
            let indexNode = this.parentNodes.indexOf(node);
            this.parentNodes[indexParent] = node;
            this.parentNodes[indexNode] = node.parent;
            //Меняем местами node с его родителем в дереве
            node.swapWithParent();
            //Запускаем рекурсию
            this.shiftNodeUp(node);
        } else {
            this.parentNodes = this.parentNodes.filter(function(index) {
                return !index.left || !index.right;
            });
          }
    }

    shiftNodeDown(node) {
        //Если детей нету, то и некуда спускаться
        if(node === null || node.left === null && node.right === null) return;
        //Если есть оба ребёнка, то ищем максимального
        if(node.left && node.right || !node.left && node.right || !node.right && node.left) {
          if(node.left && node.right && node.priority >= node.left.priority && node.priority >= node.right.priority) return;
          if(node.left && !node.right && node.priority > node.left.priority) return;
          if(!node.left && node.right && node.priority > node.right.priority) return;
            let maxChild;
            if(node.left && node.right) maxChild = Math.max(node.left.priority, node.right.priority);
            if(!node.left && node.right) maxChild = node.right.priority;
            if(node.left && !node.right) maxChild = node.left.priority;
            //Если максимальный левый ребёнок, то переопределяем ссылки, массив и делаем рекурсию
            if(node.left.priority === maxChild || !node.right && node.left) {
                //Добавляем в начало массива node
                this.parentNodes.unshift(node);
                //Меняем местами node и child
                let indexNode = this.parentNodes.lastIndexOf(node);
                let indexChild = this.parentNodes.lastIndexOf(node.left);
                this.parentNodes[indexChild] = node;
                this.parentNodes[indexNode] = node.left;
                this.parentNodes.shift();
                //Если у перемещаемой node parent = null, то определяем в root его левого ребёнка
                if(node.parent === null) this.root = node.left;
                node.left.swapWithParent();
                this.shiftNodeDown(node);
            //Если максимальный правый ребёнок, то переопределяем ссылки, массив и делаем рекурсию
            } else if(node.right.priority === maxChild || node.right && !node.left) {
                //Добавляем в начало массива node
                this.parentNodes.unshift(node);
                //Меняем местами node и child
                let indexNode = this.parentNodes.lastIndexOf(node);
                let indexChild = this.parentNodes.lastIndexOf(node.right);
                this.parentNodes[indexChild] = node;
                this.parentNodes[indexNode] = node.right;
                this.parentNodes.shift();
                //Если у перемещаемой node parent = null, то определяем в root его левого ребёнка
                if(node.parent === null) this.root = node.right;
                node.right.swapWithParent();
                this.shiftNodeDown(node);
            }
        }
    }

    pop() {
        //Если корня нет, пробрасываем метод
        if(!this.root) return;
        //Удаляем корень и сохраняем в переменную
        let detached = this.detachRoot();
        this.restoreRootFromLastInsertedNode(detached);
        this.shiftNodeDown(this.root);
        this._count--;
        return detached.data;
    }
}


module.exports = MaxHeap;
