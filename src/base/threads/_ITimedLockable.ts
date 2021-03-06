import { ILockable } from "../../threads/ILockable";

/**
 * @hidden
 */
export interface _ITimedLockable extends ILockable
{
	/**
	 * Try lock until timeout.
	 * 
	 * @param ms The maximum miliseconds for waiting.
	 * @return Whether succeded to lock or not.
	 */
	try_lock_for(ms: number): Promise<boolean>;

	/**
	 * Try lock until time expiration.
	 * 
	 * @param at The maximum time point to wait.
	 * @return Whether succeded to lock or not.
	 */
	try_lock_until(at: Date): Promise<boolean>;
}