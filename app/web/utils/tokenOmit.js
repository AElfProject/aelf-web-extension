/**
 * @file
 * @author zhouminghui
 * tokenOmit() Shortening token
*/

export default function tokenOmit(token) {
    return token.replace(token.slice(10, 26), '...');
}
