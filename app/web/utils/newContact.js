/**
 *  @file
 *  @author zhouminghui
 *  2018.10.20
 */
import pinyin from 'pinyin';

export default function newContact(name, address) {
    let Name = name;
    let Address = address;
    let srt = pinyin(Name, {
        style: pinyin.STYLE_INITIALS
    });
    srt = srt[0][0].split('');
    if (srt.length === 0) {
        srt = '#';
    }

    let Content = localStorage.content;
    Content = JSON.parse(Content);
    let Message = Content.CONTENT;
    let message = {
        name: Name,
        address: Address,
        srt: srt[0].toUpperCase(),
        index: Message.length
    };

    Message.push(message);
    Content = {
        CONTENT: Message
    };

    localStorage.setItem('content', JSON.stringify(Content));
}
