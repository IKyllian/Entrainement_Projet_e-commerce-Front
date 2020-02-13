import React from 'react';

const DescriptionsUserItem = ({label, content, fontSize}) => (
    <div style={{ fontSize: fontSize, lineHeight: '22px',  marginBottom: 7, color: 'rgba(0,0,0,0.65)' }}>
        <p style={{ marginRight: 8, display: 'inline-block', color: 'rgba(0,0,0,0.85)' }}>
            {label}:
        </p>
        {content}
    </div>
)

export default DescriptionsUserItem