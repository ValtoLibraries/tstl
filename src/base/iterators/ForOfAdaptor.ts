import { IForwardIterator } from "../../iterators/IForwardIterator";

/**
 * Adaptor for `for ... of` iteration.
 * 
 * @author Jeongho Nam <http://samchon.org>
 */
export class ForOfAdaptor<T, InputIterator extends Readonly<IForwardIterator<T, InputIterator>>> 
	implements IterableIterator<T>
{
	/**
	 * @hidden
	 */
	private it_: InputIterator;

	/**
	 * @hidden
	 */
	private last_: InputIterator;

	/**
	 * Initializer Constructor.
	 * 
	 * @param first Input iteartor of the first position.
	 * @param last Input iterator of the last position.
	 */
	public constructor(first: InputIterator, last: InputIterator)
	{
		this.it_ = first;
		this.last_ = last;
	}

	/**
	 * @inheritDoc
	 */
	public next(): IteratorResult<T>
	{
		if (this.it_.equals(this.last_))
			return {
				done: true,
				value: undefined
			};
		else
		{
			let it: InputIterator = this.it_;
			this.it_ = this.it_.next();

			return {
				done: false,
				value: it.value
			}
		}
	}

	/**
	 * @inheritDoc
	 */
	public [Symbol.iterator](): IterableIterator<T>
	{
		return this;
	}
}