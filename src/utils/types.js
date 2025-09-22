// Type definitions as JSDoc comments for better IDE support

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {number} completedCount
 * @property {boolean} trusted
 * @property {number} earnings
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} Applicant
 * @property {string} userId
 * @property {string} note
 * @property {string} appliedAt
 * @property {number} distance
 */

/**
 * @typedef {Object} Proof
 * @property {'photo'|'voice'|'code'} type
 * @property {string} [beforeImage]
 * @property {string} [afterImage]
 * @property {string} [voiceNote]
 * @property {string} [code]
 * @property {string} submittedAt
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} pay
 * @property {string} location
 * @property {string} dateTime
 * @property {'single'|'applications'} mode
 * @property {'active'|'reserved'|'completed'|'paid'|'disputed'} status
 * @property {string} posterId
 * @property {string} [workerId]
 * @property {Applicant[]} applicants
 * @property {boolean} proofRequired
 * @property {Proof} [proofSubmitted]
 * @property {boolean} escrowRequired
 * @property {string} [escrowProof]
 * @property {string} createdAt
 * @property {string} [reservedAt]
 * @property {string} [completedAt]
 * @property {string} [confirmedAt]
 * @property {string} [disputeReason]
 * @property {boolean} [taskManagerAlerted]
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} userId
 * @property {string} title
 * @property {string} message
 * @property {string} [taskId]
 * @property {string} createdAt
 * @property {boolean} read
 */

/**
 * @typedef {Object} AppState
 * @property {string} currentUserId
 * @property {Task[]} tasks
 * @property {User[]} users
 * @property {Notification[]} notifications
 */

// Export empty object to make this a module
export {};
