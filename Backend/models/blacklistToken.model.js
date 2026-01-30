const mongoose = require('mongoose');


const blacklistTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 60 * 24 
	}
});


blacklistTokenSchema.statics.blacklist = async function(token) {
	return this.create({ token });
};

blacklistTokenSchema.statics.isBlacklisted = async function(token) {
	const doc = await this.findOne({ token }).lean();
	return !!doc;
};

const BlacklistToken = mongoose.model('BlacklistToken', blacklistTokenSchema);
module.exports = BlacklistToken;