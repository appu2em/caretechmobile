// Password Change Route
router.post('/change-password', authenticateAdmin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const adminEmail = req.admin.email;
        
        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                error: 'Both passwords required!' 
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                error: 'Minimum 6 characters!' 
            });
        }
        
        // Verify current password
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: currentPassword
        });
        
        if (signInError) {
            return res.status(400).json({ 
                success: false, 
                error: 'Current password தவறு!' 
            });
        }
        
        // Update password using Admin API
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            req.admin.id,
            { password: newPassword }
        );
        
        if (updateError) {
            return res.status(400).json({ 
                success: false, 
                error: updateError.message 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Password updated!' 
        });
        
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error' 
        });
    }
});