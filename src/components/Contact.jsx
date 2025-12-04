import React from 'react';
<form className="contact-form" onSubmit={(e) => e.preventDefault()}>
    <h3>Send a Message</h3>
    <input type="text" placeholder="Your Name" required />
    <input type="tel" placeholder="Your Phone Number" required />
    <textarea placeholder="Describe your issue..." rows="5" required></textarea>
    <div className="info-item">
        <h3>Phone</h3>
        <p>+91 9226409730 (Akshay Dnyandev Ambore)</p>
    </div>
    <button type="submit" className="btn btn-primary">Send Message</button>
</form>
                </div >
            </div >
        </section >
    );
};

export default Contact;
