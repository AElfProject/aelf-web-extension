/**
 * @file utils/getPromptRoute.js
 * @author hzz780
 * 2020.08.18
 */

export default function getPromptRoute(message) {
  let method = message.payload.method ? message.payload.method : message.payload.payload.method;
  const routMap = {
    SET_PERMISSION: '#/',
    SET_CONTRACT_PERMISSION: '#/',
    LOGIN: '#/loginkeypairs',
    CALL_AELF_CONTRACT: '#/examine-approve',
    UNLOCK_NIGHT_ELF: '#/unlock',
    GET_SIGNATURE: '#/signature'
  };
  return message.router || routMap[method] || '#/confirmation';
}
