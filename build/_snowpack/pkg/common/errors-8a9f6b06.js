const ERROR_CODES = {
    MISSING_PARAMETER: 'missing_parameter',
    REMOTE_SERVICE_ERROR: 'remote_service_error',
    INVALID_STATE: 'invalid_state',
    NO_SESSION_DATA: 'no_session_data',
    DOES_NOT_EXIST: 'does_not_exist',
    FAILED_DECRYPTION_ERROR: 'failed_decryption_error',
    INVALID_DID_ERROR: 'invalid_did_error',
    NOT_ENOUGH_FUNDS_ERROR: 'not_enough_error',
    INVALID_AMOUNT_ERROR: 'invalid_amount_error',
    LOGIN_FAILED_ERROR: 'login_failed',
    SIGNATURE_VERIFICATION_ERROR: 'signature_verification_failure',
    CONFLICT_ERROR: 'conflict_error',
    NOT_ENOUGH_PROOF_ERROR: 'not_enough_proof_error',
    BAD_PATH_ERROR: 'bad_path_error',
    VALIDATION_ERROR: 'validation_error',
    PAYLOAD_TOO_LARGE_ERROR: 'payload_too_large_error',
    PRECONDITION_FAILED_ERROR: 'precondition_failed_error',
    UNKNOWN: 'unknown',
};
Object.freeze(ERROR_CODES);
class BlockstackError extends Error {
    constructor(error) {
        super();
        let message = error.message;
        let bugDetails = `Error Code: ${error.code}`;
        let stack = this.stack;
        if (!stack) {
            try {
                throw new Error();
            }
            catch (e) {
                stack = e.stack;
            }
        }
        else {
            bugDetails += `Stack Trace:\n${stack}`;
        }
        message += `\nIf you believe this exception is caused by a bug in stacks.js,
      please file a bug report: https://github.com/blockstack/stacks.js/issues\n\n${bugDetails}`;
        this.message = message;
        this.code = error.code;
        this.parameter = error.parameter ? error.parameter : undefined;
    }
    toString() {
        return `${super.toString()}
    code: ${this.code} param: ${this.parameter ? this.parameter : 'n/a'}`;
    }
}
class MissingParameterError extends BlockstackError {
    constructor(parameter, message = '') {
        super({ code: ERROR_CODES.MISSING_PARAMETER, message, parameter });
        this.name = 'MissingParametersError';
    }
}
class InvalidDIDError extends BlockstackError {
    constructor(message = '') {
        super({ code: ERROR_CODES.INVALID_DID_ERROR, message });
        this.name = 'InvalidDIDError';
    }
}
class LoginFailedError extends BlockstackError {
    constructor(reason) {
        const message = `Failed to login: ${reason}`;
        super({ code: ERROR_CODES.LOGIN_FAILED_ERROR, message });
        this.message = message;
        this.name = 'LoginFailedError';
    }
}
class FailedDecryptionError extends BlockstackError {
    constructor(message = 'Unable to decrypt cipher object.') {
        super({ code: ERROR_CODES.FAILED_DECRYPTION_ERROR, message });
        this.message = message;
        this.name = 'FailedDecryptionError';
    }
}
class InvalidStateError extends BlockstackError {
    constructor(message) {
        super({ code: ERROR_CODES.INVALID_STATE, message });
        this.message = message;
        this.name = 'InvalidStateError';
    }
}
class NoSessionDataError extends BlockstackError {
    constructor(message) {
        super({ code: ERROR_CODES.INVALID_STATE, message });
        this.message = message;
        this.name = 'NoSessionDataError';
    }
}

export { FailedDecryptionError as F, InvalidDIDError as I, LoginFailedError as L, MissingParameterError as M, NoSessionDataError as N, InvalidStateError as a };
