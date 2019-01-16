/**
 * @file Svg.jsx
 * @author huangzongzhe
 * 2018.10.09
 */
import React, {
    Component
} from 'react';
import svgslist from '../../assets/svgs';

export default class Svg extends Component {

    render() {
        let icon = this.props.icon;
        let svg = svgslist[icon];
        return (
            <div
                style={{height: 18, width: 18}}
                dangerouslySetInnerHTML={{__html: svg}}
                {...this.props}
            ></div>
        );
    }
}
