import Peer from 'simple-peer';
import appInfo from '../../../package.json';

export default {

	data: () => ({
		peer: null,
		prompt: '',
		peerMode: null,
		canWrite: false,
		mode: 'choosePeerMode',
		field: ''
	}),

	computed: {
		messages() {return this.$store.state.messages;}
	},

	filters: {
		fcup(str) {
			return str.replace(/\w/, (str) => {
				return str.toUpperCase();
			})
		}
	},

	watch: {
		'$store.state.messages'() {
			
			/* === === === === === */
			/* Always scroll to bottom
			/* === === === === === */

			this.$nextTick().then(() => {
				this.$refs.messagesList.scrollTop = this.$refs.messagesList.scrollHeight
			});

		}
	},

	methods: {
		submit() {

			if(!this.field) return;

			/* === === === === === */
			/* Set peerMode
			/* === === === === === */

			if(this.mode === 'choosePeerMode') {

				let input = this.field.toLowerCase();

				if(!['yes', 'no'].includes(input)) {

					/* === === === === === */
					/* If wrong input
					/* === === === === === */

					return this.$store.commit('addMessage', {
						type: 'system',
						text: `Please enter "Yes" or "No"`
					});

				}

				this.peerMode = input === 'yes';

				/* === === === === === */
				/* Init a peer
				/* === === === === === */

				this.$store.commit('addMessage', {
					type: 'system',
					text: `Ok. You are ${this.peerMode ? '' : 'not an '} initiator. ${!this.peerMode ? ` Get peer code from your friend using regular messengers (like WhatsApp or Telegram) and paste it in field at bottom` : ''}`
				});

				this.peer = new Peer({
					initiator: !!this.peerMode,
					trickle: false
				});

				this.mode = 'getPeer';
				this.prompt = 'Enter your friend`s peer code';

				/* === === === === === */
				/* Subscribe for errors
				/* === === === === === */

				this.peer.on('error', (data) => {

					this.$store.commit('addMessage', {
						type: 'system',
						text: `There are problems with connection. Reload browser page and try again.`
					});

					console.error(data);

					this.prompt = 'Please, reload browser page';

				});

				/* === === === === === */
				/* Get peer info
				/* === === === === === */

				this.peer.on('signal', (data) => {

					/* === === === === === */
					/* Compose JSON with peer info
					/* === === === === === */

					this.$store.commit('addMessage', {
						type: 'system',
						text: `Send that code to your friend using regular messagers: ${btoa(JSON.stringify(data))}`
					});

					if(!this.peerMode) {
						this.prompt = 'Waiting'
						this.canWrite = false;
					}

				});

				/* === === === === === */
				/* Receive message from friend
				/* === === === === === */

				this.peer.on('data', (data) => {
					this.$store.commit('addMessage', {
						type: 'friend',
						text: data.toString()
					});
				});

				/* === === === === === */
				/* When friend left
				/* === === === === === */

				this.peer.on('close', () => {
					this.$store.commit('addMessage', {
						type: 'system',
						text: `Your friend left the chat. Please refresh the page for new chat`
					});
					this.canWrite = false;
				});

				/* === === === === === */
				/* On connection
				/* === === === === === */

				this.peer.on('connect', (data) => {
					this.$store.commit('addMessage', {
						type: 'system',
						text: `Successfully connected! Send your friend something! :)`
					});

					this.mode = 'chat';
					this.prompt = 'Enter your message';
					this.canWrite = true;
				});

			}

			/* === === === === === */
			/* Get friend`s peer
			/* === === === === === */

			else if(this.mode === 'getPeer') {

				let input = JSON.parse(atob(this.field));

				this.$store.commit('addMessage', {
					type: 'system',
					text: `Waiting...`
				});

				this.peer.signal(input);

				this.prompt = 'Waiting...'
				this.canWrite = false;

			}

			/* === === === === === */
			/* Send message to friend
			/* === === === === === */

			if(this.mode === 'chat') {
				this.$store.commit('addMessage', {
					type: 'me',
					text: this.field
				});

				this.peer.send(this.field);
			}

			/* === === === === === */
			/* Clean the field
			/* === === === === === */

			this.field = '';

		}
	},

	mounted() {

		/* === === === === === */
		/* Print appInfo
		/* === === === === === */

		this.$store.commit('addMessage', {
			type: 'system',
			text: `Hi! This is p2p messenger. Your messages can be seen only by you or your friend. This is open-source project (you can see source code here: https://github.com/aleoheen/p2pmsg). Current version is: ${appInfo.version}. Author: ${appInfo.author} / aleoheen.org`
		});

		/* === === === === === */
		/* Prompt peer mode
		/* === === === === === */

		this.$store.commit('addMessage', {
			type: 'system',
			text: `Do you want to be an initiator? If yes, your frind must be NOT AN initiator`
		});

		this.prompt = 'Wanna be an initiator?';
		this.canWrite = true;

	}

}