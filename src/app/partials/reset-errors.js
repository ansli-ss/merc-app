
module.exports = resetErrors;

function resetErrors(state) {
    state.emailError.set('');
    state.passwordError.set('');
}