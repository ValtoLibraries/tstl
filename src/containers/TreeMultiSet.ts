﻿import { MultiSet } from "../base/containers/MultiSet";
import { ITreeSet } from "../base/containers/ITreeSet";
import { _Construct } from "../base/containers/_ITreeContainer";

import { _MultiSetTree } from "../base/trees/_MultiSetTree";
import { SetIterator, SetReverseIterator } from "../base/iterators/SetIterator";

import { IForwardIterator } from "../iterators/IForwardIterator";
import { Pair } from "../utilities/Pair";

/**
 * Multiple-key Set based on Tree.
 * 
 * @author Jeongho Nam <http://samchon.org>
 */
export class TreeMultiSet<Key>
	extends MultiSet<Key, TreeMultiSet<Key>>
	implements ITreeSet<Key, false, TreeMultiSet<Key>>
{
	/**
	 * @hidden
	 */
	private tree_: _MultiSetTree<Key, TreeMultiSet<Key>>;

	/* =========================================================
		CONSTRUCTORS & SEMI-CONSTRUCTORS
			- CONSTRUCTORS
			- ASSIGN & CLEAR
	============================================================
		CONSTURCTORS
	--------------------------------------------------------- */
	/**
	 * Default Constructor.
	 * 
	 * @param comp A binary function predicates *x* element would be placed before *y*. When returns `true`, then *x* precedes *y*. Note that, because *equality* is predicated by `!comp(x, y) && !comp(y, x)`, the function must not cover the *equality* like `<=` or `>=`. It must exclude the *equality* like `<` or `>`. Default is {@link less}.
	 */
	public constructor(comp?: (x: Key, y: Key) => boolean);

	/**
	 * Initializer Constructor.
	 * 
	 * @param items Items to assign.
	 * @param comp A binary function predicates *x* element would be placed before *y*. When returns `true`, then *x* precedes *y*. Note that, because *equality* is predicated by `!comp(x, y) && !comp(y, x)`, the function must not cover the *equality* like `<=` or `>=`. It must exclude the *equality* like `<` or `>`. Default is {@link less}.
	 */
	public constructor(items: Key[], comp?: (x: Key, y: Key) => boolean);
	
	/**
	 * Copy Constructor.
	 * 
	 * @param obj Object to copy.
	 */
	public constructor(obj: TreeMultiSet<Key>);

	/**
	 * Range Constructor.
	 * 
	 * @param first Input iterator of the first position.
	 * @param last Input iterator of the last position.
	 * @param comp A binary function predicates *x* element would be placed before *y*. When returns `true`, then *x* precedes *y*. Note that, because *equality* is predicated by `!comp(x, y) && !comp(y, x)`, the function must not cover the *equality* like `<=` or `>=`. It must exclude the *equality* like `<` or `>`. Default is {@link less}.
	 */
	public constructor
	(
		first: Readonly<IForwardIterator<Key>>, 
		last: Readonly<IForwardIterator<Key>>, 
		comp?: (x: Key, y: Key) => boolean
	);

	public constructor(...args: any[])
	{
		super();
		_Construct.bind(this, TreeMultiSet, _MultiSetTree)(...args);

		// // DECLARE MEMBERS
		// let comp: (x: Key, y: Key) => boolean = less;
		// let post_process: () => void = null;

		// //----
		// // INITIALIZE MEMBERS AND POST-PROCESS
		// //----
		// // BRANCH - METHOD OVERLOADINGS
		// if (args.length === 1 && args[0] instanceof TreeMultiSet)
		// {
		// 	// PARAMETERS
		// 	let container: TreeMultiSet<Key> = args[0];
		// 	comp = container.key_comp();

		// 	// COPY CONSTRUCTOR
		// 	post_process = () =>
		// 	{
		// 		let first = container.begin();
		// 		let last = container.end();

		// 		this.assign(first, last);
		// 	};
		// }
		// else if (args.length >= 1 && args[0] instanceof Array)
		// {
		// 	// FUNCTION TEMPLATE
		// 	if (args.length === 2)	comp = args[1];

		// 	// INITIALIZER LIST CONSTRUCTOR
		// 	post_process = () => 
		// 	{
		// 		let items: Key[] = args[0];
		// 		this.push(...items);
		// 	};
		// }
		// else if (args.length >= 2 && args[0].next instanceof Function && args[1].next instanceof Function)
		// {
		// 	// FUNCTION TEMPLATE
		// 	if (args.length === 3)	comp = args[2];

		// 	// RANGE CONSTRUCTOR
		// 	post_process = () =>
		// 	{
		// 		let first: Readonly<IForwardIterator<Key>> = args[0];
		// 		let last: Readonly<IForwardIterator<Key>> = args[1];

		// 		this.assign(first, last);
		// 	};
		// }
		// else if (args.length === 1)
		// {
		// 	// DEFAULT CONSTRUCTOR WITH SPECIFIED COMPARISON FUNCTION
		// 	comp = args[0];
		// }

		// //----
		// // DO PROCESS
		// //----
		// // CONSTRUCT TREE
		// this.tree_ = new _MultiSetTree<Key, TreeMultiSet<Key>>(this, comp);
		
		// // ACT POST-PROCESS
		// if (post_process !== null)
		// 	post_process();
	}

	/* ---------------------------------------------------------
		ASSIGN & CLEAR
	--------------------------------------------------------- */
	/**
	 * @inheritDoc
	 */
	public clear(): void
	{
		super.clear();

		this.tree_.clear();
	}

	/**
	 * @inheritDoc
	 */
	public swap(obj: TreeMultiSet<Key>): void
	{
		// SWAP CONTENTS
		super.swap(obj);

		// SWAP RB-TREE
		[this.tree_["source_"], obj.tree_["source_"]] = [obj.tree_["source_"], this.tree_["source_"]];
		[this.tree_, obj.tree_] = [obj.tree_, this.tree_];
	}

	/* =========================================================
		ACCESSORS
	========================================================= */
	/**
	 * @inheritDoc
	 */
	public find(key: Key): TreeMultiSet.Iterator<Key>
	{
		let node = this.tree_.nearest_by_key(key);

		if (node === null || this.tree_.key_eq()(node.value.value, key) === false)
			return this.end();
		else
			return node.value;
	}

	/**
	 * @inheritDoc
	 */
	public count(key: Key): number
	{
		let it = this.find(key);
		let cnt: number = 0;

		for (; !it.equals(this.end()) && this.tree_.key_eq()(it.value, key); it = it.next())
			cnt++;

		return cnt;
	}

	/**
	 * @inheritDoc
	 */
	public key_comp(): (x: Key, y: Key) => boolean
	{
		return this.tree_.key_comp();
	}

	/**
	 * @inheritDoc
	 */
	public value_comp(): (x: Key, y: Key) => boolean
	{
		return this.tree_.key_comp();
	}

	/**
	 * @inheritDoc
	 */
	public lower_bound(key: Key): TreeMultiSet.Iterator<Key>
	{
		return this.tree_.lower_bound(key);
	}

	/**
	 * @inheritDoc
	 */
	public upper_bound(key: Key): TreeMultiSet.Iterator<Key>
	{
		return this.tree_.upper_bound(key);
	}

	/**
	 * @inheritDoc
	 */
	public equal_range(key: Key): Pair<TreeMultiSet.Iterator<Key>, TreeMultiSet.Iterator<Key>>
	{
		return this.tree_.equal_range(key);
	}

	/**
	 * @hidden
	 */
	protected _Key_eq(x: Key, y: Key): boolean
	{
		return this.tree_.key_eq()(x, y);
	}

	/* =========================================================
		ELEMENTS I/O
			- INSERT
			- POST-PROCESS
	============================================================
		INSERT
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Insert_by_key(key: Key): TreeMultiSet.Iterator<Key>
	{
		// FIND POSITION TO INSERT
		let it: TreeMultiSet.Iterator<Key> = this.upper_bound(key);

		// ITERATOR TO RETURN
		it = this["data_"].insert(it, key);
		this._Handle_insert(it, it.next()); // POST-PROCESS

		return it;
	}

	/**
	 * @hidden
	 */
	protected _Insert_by_hint(hint: TreeMultiSet.Iterator<Key>, key: Key): TreeMultiSet.Iterator<Key>
	{
		hint;
		return this._Insert_by_key(key);
	}

	/**
	 * @hidden
	 */
	protected _Insert_by_range<U extends Key, InputIterator extends Readonly<IForwardIterator<U, InputIterator>>>
		(first: InputIterator, last: InputIterator): void
	{
		for (; !first.equals(last); first = first.next())
			this._Insert_by_key(first.value);
	}

	/* ---------------------------------------------------------
		POST-PROCESS
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Handle_insert(first: TreeMultiSet.Iterator<Key>, last: TreeMultiSet.Iterator<Key>): void
	{
		for (; !first.equals(last); first = first.next())
			this.tree_.insert(first);
	}

	/**
	 * @hidden
	 */
	protected _Handle_erase(first: TreeMultiSet.Iterator<Key>, last: TreeMultiSet.Iterator<Key>): void
	{
		for (; !first.equals(last); first = first.next())
			this.tree_.erase(first);
	}
}

export namespace TreeMultiSet
{
	//----
	// PASCAL NOTATION
	//----
	// HEAD
	export type Iterator<Key> = SetIterator<Key, false, TreeMultiSet<Key>>;
	export type ReverseIterator<Key> = SetReverseIterator<Key, false, TreeMultiSet<Key>>;

	// BODY
	export const Iterator = SetIterator;
	export const ReverseIterator = SetReverseIterator;

	//----
	// SNAKE NOTATION
	//----
	// HEAD
	export type iterator<Key> = Iterator<Key>;
	export type reverse_iterator<Key> = ReverseIterator<Key>;

	// BODY
	export const iterator = Iterator;
	export const reverse_iterator = ReverseIterator;
}
export import multiset = TreeMultiSet;